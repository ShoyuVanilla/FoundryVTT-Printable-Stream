class PrintableStreamModule {
  static onRenderChatLog(chatLog, html, data) {
    let printTitle = window.game.i18n.localize("printable-stream.print-button");
    let button = $(`<a class="printable-stream" title=${printTitle}><i class="fas fa-print"></i></a>`);
    button.on('click', (event) => PrintableStreamModule.onPrintButtonClicked())
    let element = html.find(".flexrow .control-buttons");
    element.prepend(button);
  }

  static onPrintButtonClicked() {
    if (navigator.userAgent.toLowerCase().indexOf(" electron/") !== -1) {
      let errorMessage = window.game.i18n.localize("printable-stream.electron-error-message");
      return ui.notifications.warn(errorMessage);
    }

    window.location.href = '/stream';
  }

  static addStyle(styleString) {
    const style = document.createElement('style');
    style.textContent = styleString;
    document.head.append(style);
  }
}

// Settings
Hooks.once('init', () => {
  game.settings.register('PrintableStream', 'hideButtons', {
    name: game.i18n.localize("printable-stream.hide-buttons-s"),
    hint: game.i18n.localize("printable-stream.hide-buttons-l"),
    scope: "client",
    config: true,
    default: false,
    type: Boolean
  });

  game.settings.register('PrintableStream', 'fitwidth', {
    name: game.i18n.localize("printable-stream.fitwidth-s"),
    hint: game.i18n.localize("printable-stream.fitwidth-l"),
    scope: "client",
    config: true,
    default: true,
    type: Boolean
  });

  game.settings.register('PrintableStream', 'bgColor', {
    name: game.i18n.localize("printable-stream.bgcolor-s"),
    hint: game.i18n.localize("printable-stream.bgcolor-l"),
    scope: "client",
    config: true,
    default: "transparent",
    type: String,
  });
});

Hooks.on('init', () => {
  const url = window.location.pathname;
  if (/\/stream/.test(url)) {
    // Increase ChatMessage batch size to render all messages
    CONFIG.ChatMessage.batchSize = Number.MAX_SAFE_INTEGER;

    // Inject css
    let cssId = 'modules/PrintableStream/printable-stream.css';
    if (!document.getElementById(cssId)) {
        let head  = document.getElementsByTagName('head')[0];
        let link  = document.createElement('link');
        link.id   = cssId;
        link.rel  = 'stylesheet';
        link.type = 'text/css';
        link.href = cssId;
        link.media = 'all';
        head.appendChild(link);
    }

    // Apply settings
    const hideButtons = game.settings.get('PrintableStream', 'hideButtons');
    const fitwidth = game.settings.get('PrintableStream', 'fitwidth');
    const bgColor = game.settings.get('PrintableStream', 'bgColor');

    if (hideButtons) {
      PrintableStreamModule.addStyle(`
        button {
          display: none;
        }
      `);
    }

    if (fitwidth) {
      PrintableStreamModule.addStyle(`
        body.stream .tab[data-tab] {
          width: 100%;
        }
      `);
    }

    PrintableStreamModule.addStyle(`
      body.stream {
        background: ${bgColor};
      }
    `);
  }
});

Hooks.on('renderChatLog', PrintableStreamModule.onRenderChatLog);
