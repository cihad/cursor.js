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
