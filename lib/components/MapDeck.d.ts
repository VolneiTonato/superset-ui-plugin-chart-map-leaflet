import { ChartProps } from '@superset-ui/core';
declare type MapDeckProps = Partial<ChartProps> & {
    points: Array<any>;
    height: number;
    width: number;
    totalRegistros: number;
    hash: string;
};
export default function MapDeck({ height, width, points, datasource, formData, totalRegistros, hash }: MapDeckProps): JSX.Element;
export {};
//# sourceMappingURL=MapDeck.d.ts.map