// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs'
import * as path from 'path'
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  console.log('image-finder active')
  
	let disposable = vscode.commands.registerCommand('imgage-find.open-search', () => {
		// The code you place here will be executed every time your command is executed
    const panel = vscode.window.createWebviewPanel(
      "imageList",
      '图片搜索',
      vscode.ViewColumn.One,
      {
        enableScripts: true,
        retainContextWhenHidden: true
      }
    )
    panel.webview.html = getWebViewContent(context, 'webview/build/index.html')

	});

	context.subscriptions.push(disposable);
}

function getExtensionFileAbsolutePath(context: vscode.ExtensionContext, relativePath: string) {
  return path.join(context.extensionPath, relativePath);
}

function getWebViewContent(context: vscode.ExtensionContext, templatePath: string) {
  const resourcePath = getExtensionFileAbsolutePath(context, templatePath);
  const dirPath = path.dirname(resourcePath);
  let html = fs.readFileSync(resourcePath, 'utf-8');
  // vscode不支持直接加载本地资源，需要替换成其专有路径格式，这里只是简单的将样式和JS的路径替换
  html = html.replace(/(<link.+?href="|<script.+?src="|<img.+?src=")(.+?)"/g, (m, $1, $2) => {
      return $1 + vscode.Uri.file(path.resolve(dirPath, $2)).with({ scheme: 'vscode-resource' }).toString() + '"';
  });
  console.log(html)
  return html
}

// this method is called when your extension is deactivated
export function deactivate() {}
