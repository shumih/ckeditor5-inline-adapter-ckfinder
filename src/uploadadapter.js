/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see https://ckeditor.com/legal/ckeditor-oss-license
 */

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import FileRepository from '@ckeditor/ckeditor5-upload/src/filerepository';

/**
 * A plugin that write selected image inline.
 *
 * @extends module:core/plugin~Plugin
 */
export default class CKFinderInlineUploadAdapter extends Plugin {
  /**
   * @inheritDoc
   */
  static get requires() {
    return [FileRepository];
  }

  /**
   * @inheritDoc
   */
  static get pluginName() {
    return 'CKFinderInlineUploadAdapter';
  }

  /**
   * @inheritDoc
   */
  init() {
    // Register CKFinderAdapter
    this.editor.plugins.get(FileRepository).createUploadAdapter = loader => ({
      upload: async () => this._fileAsBase64(await loader.file),
      abort: () => {},
    });
  }

  _fileAsBase64(file) {
    const reader = new FileReader();

    return new Promise((resolve, reject) => {
      reader.addEventListener('loadend', function(e) {
        const result = e.target.result;
        const source = `data:${file.type};base64, ${result.substr(result.indexOf(',') + 1)}`;

        resolve({
          default: source,
        });
      });
      reader.addEventListener('error', reject);

      reader.readAsDataURL(file.slice());
    });
  }
}
