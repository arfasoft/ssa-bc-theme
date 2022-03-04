import PageManager from './page-manager';
import initializeSquareFootageCalculator from './product/sq-ft-calc';

export default class Page extends PageManager {
  onReady() {
    initializeSquareFootageCalculator();
  }
}
