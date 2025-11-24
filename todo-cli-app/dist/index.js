#!/usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const chalk_1 = __importDefault(require("chalk"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const program = new commander_1.Command();
const DATA_FILE = path.join(process.cwd(), 'todo.json');
function loadTodos() {
    if (!fs.existsSync(DATA_FILE)) {
        return [];
    }
    const data = fs.readFileSync(DATA_FILE, 'utf-8');
    try {
        return JSON.parse(data);
    }
    catch {
        return [];
    }
}
function saveTodos(todos) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(todos, null, 2));
}
program
    .version('1.0.0')
    .description('A Simple Command Line To-Do List Manager');
program
    .command('add <task>')
    .description('Add a new To-Do item')
    .action((task) => {
    const todos = loadTodos();
    const newId = todos.length > 0 ? todos[todos.length - 1].id + 1 : 1;
    const newTodo = {
        id: newId,
        task: task,
        completed: false
    };
    todos.push(newTodo);
    saveTodos(todos);
    console.log(chalk_1.default.green(`Added To-Do: "${task}" with ID ${newId}`));
});
program
    .command('list')
    .description('Show all To-Do items')
    .action(() => {
    const todos = loadTodos();
    if (todos.length === 0) {
        console.log(chalk_1.default.yellow('No To-Do items found.'));
        return;
    }
    console.log(chalk_1.default.bold.cyan('\n--- Your To-Do List ---'));
    todos.forEach(todo => {
        const status = todo.completed ? chalk_1.default.strikethrough.gray('Done') : chalk_1.default.red('TODO');
        const taskText = todo.completed ? chalk_1.default.gray(todo.task) : chalk_1.default.white(todo.task);
        console.log(`[${todo.id}] ${status} ${taskText}`);
    });
    console.log(chalk_1.default.bold.cyan('-----------------------\n'));
});
program
    .command('complete <id>')
    .description('Mark a To-Do item as completed by its ID')
    .action((idStr) => {
    const id = parseInt(idStr);
    const todos = loadTodos();
    const todo = todos.find(t => t.id === id);
    if (todo) {
        todo.completed = true;
        saveTodos(todos);
        console.log(chalk_1.default.green(`Marked To-Do ID ${id} as completed.`));
    }
    else {
        console.log(chalk_1.default.red(`To-Do with ID ${id} not found.`));
    }
});
program
    .command('delete <id>')
    .description('Delete a To-Do item permanently by its ID')
    .action((idStr) => {
    const id = parseInt(idStr);
    const todos = loadTodos();
    const newTodos = todos.filter(t => t.id !== id);
    if (newTodos.length < todos.length) {
        saveTodos(newTodos);
        console.log(chalk_1.default.red.bold(` Deleted To-Do ID ${id}.`));
    }
    else {
        console.log(chalk_1.default.yellow(` To-Do with ID ${id} not found. Nothing deleted.`));
    }
});
program.parse(process.argv);
