import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule, {
  useJit: true,
  preserveWhitespaces: true
})
.catch(err => console.log(err))
.then(() => {
  // Thiết lập MutationObserver sau khi module đã được bootstrap
  const targetNode = document.getElementById('myElement');
  if (targetNode) {
    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.type === 'childList') {
          console.log('A child node has been added or removed.');
        }
      }
    });

    const config = { childList: true, subtree: true };
    observer.observe(targetNode, config);

    // Để ngừng quan sát
    // observer.disconnect();
  }
});
