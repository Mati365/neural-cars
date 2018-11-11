import GameView from '../GameView';
import EditorCellSheet from '../editor/EditorCellSheet';

export default class Editor extends GameView {
  sheet = new EditorCellSheet;

  render(ctx, size) {
    const {sheet} = this;

    sheet.render(ctx, size);
  }
}
