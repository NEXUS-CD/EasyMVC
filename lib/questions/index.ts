const inquirer = require('inquirer');

module.exports = async function input() {
  const answer = await inquirer.prompt([
    {
      type: 'input',
      name: 'inputValue',
      message: '请输入内容：',
    },
  ]);
  
  console.log('你输入的内容是：', answer.inputValue);
};
