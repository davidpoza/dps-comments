import natural from 'natural';
import { dirname } from 'path';
import csv from 'csv-parser';
import fs from 'fs';
import minimist from 'minimist';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const stateFilepath = `${__dirname}/state.json`;
const args = minimist(process.argv.slice(2));
const trainingFile = `${__dirname}/datasets/${args?.dataset}`;
let classifier;

if (fs.existsSync(stateFilepath)) {
  classifier = natural.BayesClassifier.restore(JSON.parse(fs.readFileSync(stateFilepath)));
  console.log('✅ presaved state loaded from state.json!');
} else {
  classifier = new natural.BayesClassifier();
}

if (args?.dataset && fs.existsSync(trainingFile)) {
  console.log('✅ training begins!. Please wait.');
  fs.createReadStream(trainingFile)
  .pipe(csv())
  .on('data', (row) => {
    if (row.text && row.label) {
      classifier.addDocument(row.text, row.label)
    }
  })
  .on('end', () => {
    classifier.train();
    console.log('✅ training completed!');
    if (args?.test) {
      console.log(classifier.classify(args?.test));

    }
    classifier.save(stateFilepath, function(err, classifier) {
      console.log("✅ classifier saved")
    });
  });
} else if (args?.test) {
  console.log(classifier.classify(args?.test));
}