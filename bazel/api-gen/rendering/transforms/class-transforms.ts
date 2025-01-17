/*!
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */

import {ClassEntry} from '../entities';
import {ClassEntryRenderable} from '../entities/renderables';
import {addRenderableCodeToc} from './code-transforms';
import {
  addHtmlAdditionalLinks,
  addHtmlDescription,
  addHtmlJsDocTagComments,
  addHtmlUsageNotes,
} from './jsdoc-transforms';
import {addRenderableGroupMembers} from './member-transforms';
import {addModuleName} from './module-name';

/** Given an unprocessed class entry, get the fully renderable class entry. */
export function getClassRenderable(
  classEntry: ClassEntry,
  moduleName: string,
): ClassEntryRenderable {
  return addRenderableCodeToc(
    addRenderableGroupMembers(
      addHtmlAdditionalLinks(
        addHtmlUsageNotes(
          addHtmlJsDocTagComments(addHtmlDescription(addModuleName(classEntry, moduleName))),
        ),
      ),
    ),
  );
}
