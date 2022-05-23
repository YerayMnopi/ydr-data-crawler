export interface BasePage {
    url: string;
    selectors: {[key:string]: string | {}};
    actions: {[key: string]: () => {}};
}