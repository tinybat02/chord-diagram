import { FieldBuffer, Buffer } from '../types';

interface Store {
  [key: string]: number;
}

export const processReceivedData = (length: number, fields: FieldBuffer[]) => {
  const { buffer: bufferSource } = fields[0].values as Buffer;
  const { buffer: bufferTarget } = fields[1].values as Buffer;
  const { buffer: bufferValue } = fields[2].values as Buffer;

  const allNodes = [...new Set([...bufferSource, ...bufferTarget])];
  const indexStore: Store = {};
  allNodes.map(node => (indexStore[node] = allNodes.indexOf(node)));

  const matrix = [...Array(allNodes.length)].map(e => Array(allNodes.length).fill(0));

  for (let i = 0; i < length; i++) {
    const row = indexStore[bufferSource[i]];
    const column = indexStore[bufferTarget[i]];

    matrix[row][column] += bufferValue[i];
    matrix[column][row] += bufferValue[i] - 1;
  }
  matrix[indexStore[bufferSource[0]]][indexStore[bufferTarget[0]]] = bufferValue[0];

  return { matrix, keys: allNodes };
};
