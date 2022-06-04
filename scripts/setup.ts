import inquirer from 'inquirer';
import fs from 'fs';
import json from '../config.json';

const keys = Object.keys(json);
const questions = keys.map((name) => ({type: 'input', name}));

inquirer.prompt(questions).then((answers) => {
  fs.writeFileSync('config.json', JSON.stringify({...answers}));
});