/* eslint-disable @typescript-eslint/no-var-requires */
const { parse } = require('fast-csv');
const { createReadStream } = require('node:fs');
const { join } = require('node:path');
const { QueryInterface } = require('sequelize');

const MODEL_TO_CSV_MAP = {
  users: 'users',
};

const CSV_SEEDS_FOLDER_PATH = join(__dirname, 'csv_seeds');
async function readCsvFile(filePath) {
  return new Promise((res, rej) => {
    const rows = [];
    const stream = createReadStream(filePath);
    const data = stream
      .pipe(parse({ headers: true }))
      .on('data', (row) => rows.push(row))
      .on('end', (rowCount) => {
        console.log(`Parsed ${rowCount} rows successfully from ${filePath}`);
        res(rows);
      })
      .on('error', (err) => rej(err));
    return data;
  });
}
/**
 * read csv data and run
 * @param {*} modelName
 * @param {QueryInterface} queryInterface
 */
const csvSeeder = async (modelName, queryInterface) => {
  try {
    if (!MODEL_TO_CSV_MAP[modelName]) throw new Error('csv seed not found');
    const csvPath = join(
      CSV_SEEDS_FOLDER_PATH,
      `${MODEL_TO_CSV_MAP[modelName]}.csv`,
    );

    const rows = await readCsvFile(csvPath);
    return queryInterface.bulkInsert(modelName, rows);
  } catch (err) {
    console.log(err);
  }
};

module.exports = { csvSeeder };
