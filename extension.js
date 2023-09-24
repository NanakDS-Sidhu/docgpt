// import Docxtemplater from 'docxtemplater';


const vscode = require('vscode');
const openai = require('openai'); // Make sure you have 'openai' package installed
const fs = require('fs');
const path = require('path');



// Your OpenAI API key
const apiKey = 'Your_API';

const client = new openai({ apiKey });

async function generateDocumentation() {
    // Get the currently opened text document
	
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        return;
    }

    // Get the code from the editor
    const code = editor.document.getText();

    // Use ChatGPT to generate documentation
    const response = await client.completions.create({
		model:"gpt-3.5-turbo-instruct",
        prompt: `Generate documentation for the following code:\n${code}`,
        max_tokens: 1000, // Adjust the max tokens as needed
    });

    // Extract the generated documentation from the response
    const documentation = response.choices[0].text;

    const currentFilePath = editor.document.fileName;
    const currentFileDir = path.dirname(currentFilePath);

    // Create a new .txt file with the same name as the currently opened file
    const currentFileName = path.basename(currentFilePath, path.extname(currentFilePath));
    const txtFilePath = path.join(currentFileDir, `${currentFileName}.txt`);

    // Save the generated documentation to the .txt file
    fs.writeFileSync(txtFilePath, documentation);

    vscode.window.showInformationMessage(`Documentation generated and saved to ${txtFilePath}`);

}

function activate(context) {
    console.log('Congratulations, your extension "docgpt" is now active!');

    // Register the "docgpt.generateDocumentation" command
    let disposable = vscode.commands.registerCommand('docgpt.generateDocumentation', generateDocumentation);
    context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
};