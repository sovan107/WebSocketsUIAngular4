import { WebsocketUiPage } from './app.po';

describe('websocket-ui App', () => {
  let page: WebsocketUiPage;

  beforeEach(() => {
    page = new WebsocketUiPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
