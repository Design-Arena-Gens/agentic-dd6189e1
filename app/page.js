'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [newTime, setNewTime] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const saved = localStorage.getItem('dailyTasks');
    if (saved) {
      setTasks(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('dailyTasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (newTask.trim()) {
      setTasks([
        ...tasks,
        {
          id: Date.now(),
          text: newTask,
          time: newTime,
          completed: false,
          createdAt: new Date().toISOString()
        }
      ]);
      setNewTask('');
      setNewTime('');
    }
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    if (!a.time && !b.time) return 0;
    if (!a.time) return 1;
    if (!b.time) return -1;
    return a.time.localeCompare(b.time);
  });

  const filteredTasks = sortedTasks.filter(task => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  const completedCount = tasks.filter(t => t.completed).length;
  const totalCount = tasks.length;

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>📅 Daily Routine & Tasks</h1>

        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statValue}>{completedCount}/{totalCount}</span>
            <span className={styles.statLabel}>Completed</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statValue}>{Math.round((completedCount / totalCount) * 100) || 0}%</span>
            <span className={styles.statLabel}>Progress</span>
          </div>
        </div>

        <div className={styles.inputGroup}>
          <input
            type="text"
            placeholder="Add a new task..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTask()}
            className={styles.input}
          />
          <input
            type="time"
            value={newTime}
            onChange={(e) => setNewTime(e.target.value)}
            className={styles.timeInput}
          />
          <button onClick={addTask} className={styles.addButton}>
            + Add
          </button>
        </div>

        <div className={styles.filters}>
          <button
            className={filter === 'all' ? styles.filterActive : styles.filterButton}
            onClick={() => setFilter('all')}
          >
            All ({totalCount})
          </button>
          <button
            className={filter === 'active' ? styles.filterActive : styles.filterButton}
            onClick={() => setFilter('active')}
          >
            Active ({totalCount - completedCount})
          </button>
          <button
            className={filter === 'completed' ? styles.filterActive : styles.filterButton}
            onClick={() => setFilter('completed')}
          >
            Completed ({completedCount})
          </button>
        </div>

        <div className={styles.taskList}>
          {filteredTasks.length === 0 ? (
            <div className={styles.emptyState}>
              {filter === 'all' ? '🎯 No tasks yet. Add one above!' : `No ${filter} tasks`}
            </div>
          ) : (
            filteredTasks.map(task => (
              <div
                key={task.id}
                className={`${styles.taskItem} ${task.completed ? styles.taskCompleted : ''}`}
              >
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task.id)}
                  className={styles.checkbox}
                />
                <div className={styles.taskContent}>
                  <span className={styles.taskText}>{task.text}</span>
                  {task.time && (
                    <span className={styles.taskTime}>🕐 {task.time}</span>
                  )}
                </div>
                <button
                  onClick={() => deleteTask(task.id)}
                  className={styles.deleteButton}
                >
                  ×
                </button>
              </div>
            ))
          )}
        </div>

        {tasks.length > 0 && (
          <div className={styles.footer}>
            <button
              onClick={() => setTasks(tasks.filter(t => !t.completed))}
              className={styles.clearButton}
            >
              Clear Completed
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
