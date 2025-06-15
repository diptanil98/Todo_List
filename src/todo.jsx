import { useState, useEffect } from "react";

const TodoApp = () => {
    const [task, setTask] = useState("");
    const [todo, setTodo] = useState(() => {
        const saved = JSON.parse(localStorage.getItem("todo"));
        return saved || [];
    });
    const [checkedItems, setCheckedItems] = useState(() => {
        const saved = JSON.parse(localStorage.getItem("checkedItems"));
        return saved || {};
    });
    const [filter, setFilter] = useState("all");
    const [sortOrder, setSortOrder] = useState("none");

    useEffect(() => {
        localStorage.setItem("todo", JSON.stringify(todo));
        localStorage.setItem("checkedItems", JSON.stringify(checkedItems));
    }, [todo, checkedItems]);
    const add = () => {
        if (task.trim()) {
            setTodo([...todo, task.trim()]);
            setTask("");
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!task.trim()) return;
        add();
    }

    const handleChange = (e) => {
        setTask(e.target.value);
    };

     const deleteTodo = (index) => {
    const newTodo = todo.filter((_, i) => i !== index);
    const newChecked = {};
    Object.keys(checkedItems).forEach((key) => {
      const k = parseInt(key);
      if (k < index) newChecked[k] = checkedItems[k];
      if (k > index) newChecked[k - 1] = checkedItems[k];
    });
    setTodo(newTodo);
    setCheckedItems(newChecked);
  };

    const handleCheck = (index) => {
        setCheckedItems(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    const getVisibleTodos = () => {
        let visible = todo.map((task, index) => ({ task, index }));


        if (filter === "completed") {
            visible = visible.filter(({ index }) => checkedItems[index]);
        } else if (filter === "pending") {
            visible = visible.filter(({ index }) => !checkedItems[index]);
        }


        if (sortOrder === "asc") {
            visible.sort((a, b) => a.task.localeCompare(b.task));
        } else if (sortOrder === "desc") {
            visible.sort((a, b) => b.task.localeCompare(a.task));
        }

        return visible;
    };

    const getStats = () => {
        const completed = Object.values(checkedItems).filter(Boolean).length;
        const total = todo.length;
        const pending = total - completed;
        return { completed, total, pending };
    };

    const stats = getStats();

    return (
        <>
        
            <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 flex items-center justify-center p-4">
                <div className="w-full max-w-lg bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20">
                    <div className="flex items-center justify-center mb-8">
                        <div className="text-center">
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                Todo List
                            </h1>
                            <p className="text-gray-600 mt-2">Stay organized, stay productive</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3 mb-6">
                        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl p-3 text-white text-center shadow-lg">
                            <div className="text-lg font-bold">{stats.total}</div>
                            <div className="text-xs opacity-90">Total</div>
                        </div>
                        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl p-3 text-white text-center shadow-lg">
                            <div className="text-lg font-bold">{stats.completed}</div>
                            <div className="text-xs opacity-90">Done</div>
                        </div>
                        <div className="bg-gradient-to-r from-orange-500 to-pink-500 rounded-xl p-3 text-white text-center shadow-lg">
                            <div className="text-lg font-bold">{stats.pending}</div>
                            <div className="text-xs opacity-90">Pending</div>
                        </div>
                    </div>
                    <div className="mb-6">
                        <div className="flex bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                            <input
                                type="text"
                                placeholder="What needs to be done?"
                                value={task}
                                onChange={handleChange}
                                onKeyPress={(e) => e.key === 'Enter' && handleSubmit(e)}
                                className="flex-1 px-6 py-4 text-gray-700 placeholder-gray-400 focus:outline-none text-lg"
                            />
                            <button
                                onClick={handleSubmit}
                                className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-4 hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                            >
                                <span className="flex items-center space-x-2">
                                    <span>Add</span>
                                </span>
                            </button>
                        </div>
                    </div>
                    <div className="flex justify-between mb-6 space-x-4">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Filter</label>
                            <select
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-2 text-gray-700 focus:outline-none focus:border-indigo-500 transition-colors"
                            >
                                <option value="all">🔍 All Tasks</option>
                                <option value="completed">✅ Completed</option>
                                <option value="pending">⏳ Pending</option>
                            </select>
                        </div>

                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Sort</label>
                            <select
                                value={sortOrder}
                                onChange={(e) => setSortOrder(e.target.value)}
                                className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-2 text-gray-700 focus:outline-none focus:border-indigo-500 transition-colors"
                            >
                                <option value="none">📝 Default</option>
                                <option value="asc">🔤 A → Z</option>
                                <option value="desc">🔤 Z → A</option>
                            </select>
                        </div>
                    </div>
                    <div className="space-y-3 max-h-80 overflow-y-auto">
                        {getVisibleTodos().length === 0 ? (
                            <div className="text-center py-12">
                                <div className="text-6xl mb-4">🎯</div>
                                <p className="text-gray-500 text-lg">
                                    {filter === "all" ? "No tasks yet. Add one above!" :
                                        filter === "completed" ? "No completed tasks yet." :
                                            "No pending tasks. Great job!"}
                                </p>
                            </div>
                        ) : (
                            getVisibleTodos().map(({ task, index }) => (
                                <div
                                    key={index}
                                    className={`group flex items-center justify-between bg-white rounded-2xl px-6 py-4 shadow-md border-2 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 ${checkedItems[index]
                                            ? 'border-emerald-200 bg-emerald-50'
                                            : 'border-gray-200 hover:border-indigo-300'
                                        }`}
                                >
                                    <div className="flex items-center space-x-4 flex-1">
                                        <div className="relative">
                                            <input
                                                type="checkbox"
                                                checked={checkedItems[index] || false}
                                                onChange={() => handleCheck(index)}
                                                className="w-6 h-6 text-emerald-500 bg-white border-2 border-gray-300 rounded-lg focus:ring-emerald-500 focus:ring-2 transition-colors"
                                            />
                                            {checkedItems[index] && (
                                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                    <span className="text-emerald-500 text-sm font-bold">✓</span>
                                                </div>
                                            )}
                                        </div>
                                        <span className={`text-gray-800 text-lg transition-all duration-200 ${checkedItems[index]
                                                ? 'line-through text-gray-500'
                                                : ''
                                            }`}>
                                            {task}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => deleteTodo(index)}
                                        className="opacity-0 group-hover:opacity-100 bg-red-500 hover:bg-red-600 text-white rounded-xl p-2 transition-all duration-200 transform hover:scale-110 shadow-lg"
                                        title="Delete task"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        
        </>
    );
};

export default TodoApp;