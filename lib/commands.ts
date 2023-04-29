import inquirer from "inquirer";

// 启动cil进行交互
export const userPrompt = async (Questions) => {
    return await inquirer.prompt(Questions)
}