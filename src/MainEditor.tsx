import React, { PureComponent } from 'react';
import { PanelEditorProps } from '@grafana/data';

import { PanelOptions } from './types';

export class MainEditor extends PureComponent<PanelEditorProps<PanelOptions>> {
  render() {
    return <div className="section gf-form-group"></div>;
  }
}
