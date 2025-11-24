#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import * as fs from 'fs';
import * as path from 'path';

const program = new Command();

const DATA_FILE = path.join(process.cwd(), 'todo.json');

interface todo {
    id: number;
    task: string;
    completed: boolean;
}

function loadTodos(): todo[] {
    if (!fs.existsSync(DATA_FILE)) {
        return [];
    }
    const data = fs.readFileSync(DATA_FILE, 'utf-8');
    
    try {
        return JSON.parse(data);
    } catch {
        return [];
    }
}

function saveTodos(todos: todo[]): void {
    fs.writeFileSync(DATA_FILE, JSON.stringify(todos, null, 2));
}
program
    .version('1.0.0')
    .description('A Simple Command Line To-Do List Manager');

program
    .command('add <task>')
    .description('Add a new To-Do item')
    .action((task: string) => {
        const todos = loadTodos();
        const newId = todos.length > 0 ? todos[todos.length - 1].id + 1 : 1;
        const newTodo: todo = {
            id: newId,
            task: task,
            completed: false
        };
        todos.push(newTodo);
        saveTodos(todos);
        console.log(chalk.green(`Added To-Do: "${task}" with ID ${newId}`));
    });

program
    .command('list')
    .description('Show all To-Do items')
    .action(() => {
        const todos = loadTodos();
        if (todos.length === 0) {
            console.log(chalk.yellow('No To-Do items found.'));
            return;
        }
        console.log(chalk.bold.cyan('\n--- Your To-Do List ---'));
        todos.forEach(todo => {
            const status = todo.completed ? chalk.strikethrough.gray('Done') : chalk.red('TODO');
            const taskText = todo.completed ? chalk.gray(todo.task) : chalk.white(todo.task);
            console.log(`[${todo.id}] ${status} ${taskText}`);
        });
        console.log(chalk.bold.cyan('-----------------------\n'));
    });

program
    .command('complete <id>')
    .description('Mark a To-Do item as completed by its ID')
    .action((idStr: string) => {
        const id = parseInt(idStr);
        const todos = loadTodos();
        const todo = todos.find(t => t.id === id);
        if (todo) {
            todo.completed = true;
            saveTodos(todos);
            console.log(chalk.green(`Marked To-Do ID ${id} as completed.`));
        } else {
            console.log(chalk.red(`To-Do with ID ${id} not found.`));
        }
    });

program.parse(process.argv);