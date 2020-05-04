import React, { PureComponent } from 'react';
import { PanelProps } from '@grafana/data';
import { PanelOptions, FieldBuffer } from 'types';
import { ResponsiveChord } from '@nivo/chord';
import { TableTooltip, Chip } from '@nivo/tooltip';
import { processReceivedData } from './utils/helpFunc';

interface Props extends PanelProps<PanelOptions> {}
interface State {
  matrix: Array<Array<number>> | null;
  keys: Array<string> | null;
}

interface Ribbon {
  source: {
    color: string;
    id: string;
    value: number;
  };
  target: {
    color: string;
    id: string;
    value: number;
  };
}

const RibbonTooltip = ({ ribbon }: { ribbon: Ribbon }) => (
  <TableTooltip
    rows={[
      [
        <Chip key="chip" color={ribbon.source.color} />,
        <strong key="id">{ribbon.source.id}</strong>,
        '>>',
        <Chip key="chip" color={ribbon.target.color} />,
        <strong key="id">{ribbon.target.id}</strong>,
        ribbon.source.value,
      ],
    ]}
  />
);

export class MainPanel extends PureComponent<Props> {
  state: State = {
    matrix: null,
    keys: null,
  };

  componentDidMount() {
    const { matrix, keys } = processReceivedData(
      this.props.data.series[0].length,
      this.props.data.series[0].fields as FieldBuffer[]
    );
    this.setState({ matrix, keys });
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.data.series[0] !== this.props.data.series[0]) {
      const { matrix, keys } = processReceivedData(
        this.props.data.series[0].length,
        this.props.data.series[0].fields as FieldBuffer[]
      );
      this.setState({ matrix, keys });
    }
  }

  render() {
    const { width, height } = this.props;
    const { matrix, keys } = this.state;

    if (!matrix || !keys) {
      return <div />;
    }

    return (
      <div
        style={{
          width,
          height,
        }}
      >
        <ResponsiveChord
          matrix={matrix}
          keys={keys}
          margin={{ top: 60, right: 60, bottom: 90, left: 60 }}
          valueFormat=".2f"
          padAngle={0.08}
          innerRadiusRatio={0.96}
          innerRadiusOffset={0.02}
          arcOpacity={1}
          arcBorderWidth={1}
          arcBorderColor={{ from: 'color', modifiers: [['darker', 0.4]] }}
          ribbonOpacity={0.5}
          ribbonBorderWidth={1}
          // @ts-ignore
          ribbonBorderColor={{ from: 'color', modifiers: [['darker', 0.4]] }}
          enableLabel={true}
          label="id"
          labelOffset={12}
          // labelRotation={-90}
          labelTextColor={{ from: 'color', modifiers: [['darker', 1]] }}
          colors={{ scheme: 'nivo' }}
          isInteractive={true}
          arcHoverOpacity={1}
          arcHoverOthersOpacity={0.25}
          ribbonHoverOpacity={0.6}
          ribbonHoverOthersOpacity={0}
          ribbonTooltip={RibbonTooltip}
          animate={true}
          motionStiffness={90}
          motionDamping={7}
          legends={[
            {
              anchor: 'bottom-right',
              direction: 'column',
              justify: false,
              translateX: 30,
              translateY: 70,
              itemWidth: 80,
              itemHeight: 14,
              itemsSpacing: 0,
              itemTextColor: '#999',
              itemDirection: 'left-to-right',
              symbolSize: 12,
              symbolShape: 'circle',
              effects: [
                {
                  on: 'hover',
                  style: {
                    itemTextColor: '#000',
                  },
                },
              ],
            },
          ]}
        />
      </div>
    );
  }
}
