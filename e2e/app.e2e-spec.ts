import { ExpensesLogPage } from './app.po';

describe('expenses-log App', () => {
  let page: ExpensesLogPage;

  beforeEach(() => {
    page = new ExpensesLogPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
