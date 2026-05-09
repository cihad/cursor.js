#!/bin/bash

# Add todoToDelete state
sed -i -e '/const \[todoInput, setTodoInput/a \  const [todoToDelete, setTodoToDelete] = useState<number | null>(null);' apps/docs/src/app/\(home\)/ClientPage.tsx

# Create a temporary file with the updated JSX for the delete button
cat << 'INNER_EOF' > tmp.jsx
                            {todoToDelete === todo.id ? (
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground mr-1">Sure?</span>
                                <button
                                  id={`todo-confirm-delete`}
                                  onClick={() => {
                                    deleteTodo(todo.id);
                                    setTodoToDelete(null);
                                  }}
                                  className="text-xs px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                                >
                                  Yes
                                </button>
                                <button
                                  id={`todo-cancel-delete`}
                                  onClick={() => setTodoToDelete(null)}
                                  className="text-xs px-2 py-1 bg-slate-200 text-slate-800 rounded hover:bg-slate-300 transition-colors dark:bg-slate-700 dark:text-slate-200"
                                >
                                  No
                                </button>
                              </div>
                            ) : (
                              <button
                                id={`todo-delete-${todo.id}`}
                                onClick={() => setTodoToDelete(todo.id)}
                                className="text-red-500 opacity-50 hover:opacity-100 transition-opacity"
                              >
                                Delete
                              </button>
                            )}
INNER_EOF

# Extract lines from 1682 to 1688 and replace with tmp.jsx
sed -i -e '/id={`todo-delete-${todo.id}`}/,/<\/button>/c\' -e "$(cat tmp.jsx | sed 's/$/\\/')" apps/docs/src/app/\(home\)/ClientPage.tsx

rm tmp.jsx

# Also fix the sequence section for wait/click
cat << 'INNER_EOF' > tmp_seq.ts
          .if(
            () => !!settings.plugins.outline,
            (ctx) =>
              (ctx as any)
                .outlineUnderline('.todo-item-2', { duration: 1000, loopCount: 2 })
                .wait(300),
          )
          .hover('#todo-delete-2')
          .wait(300)
          .click('#todo-delete-2')
          .wait(1000)
          .if(
            () => !!settings.plugins.prompt,
            (ctx) =>
              (ctx as any)
                .prompt("Would you really like to delete this item?", {
                   buttons: [{ label: 'Yes, click delete!', onClick: 'continue', type: 'danger' }]
                 })
          )
          .wait(500)
          .hover('#todo-confirm-delete')
          .wait(300)
          .click('#todo-confirm-delete')
          .wait(1000)
INNER_EOF

