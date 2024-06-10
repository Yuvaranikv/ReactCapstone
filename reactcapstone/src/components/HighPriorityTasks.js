// HighPriorityTasks.js
import React from 'react';

const HighPriorityTasks = ({ tasks }) => {
    return (
        <div>
            <h3>High Priority Tasks</h3>
            {tasks.length === 0 ? (
                <p>No high priority tasks found.</p>
            ) : (
                <ul>
                    {tasks.map(task => (
                        <li key={task.id}>
                            {task.description} - Due: {task.deadline}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default HighPriorityTasks;
