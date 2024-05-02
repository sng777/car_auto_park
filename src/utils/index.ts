import { CarProps } from "../interfaces";

export const OnAddingCar = (
  oldData: CarProps[],
  startIndex: number,
  index: number,
  newItem: CarProps[],
  fristPark: boolean
) => {
  const result = fristPark
    ? [
        ...oldData.slice(startIndex, index),
        ...newItem.map((item) => item),
        ...oldData.slice(index),
      ]
    : [
        ...oldData.slice(0, startIndex),
        ...newItem.map((item) => item),
        ...oldData.slice(startIndex, index - 1),
        ...oldData.slice(index, oldData.length),
      ];
  return result;
};

export const OnInsertCar = (
  oldData: CarProps[],
  index: number,
  newItem: CarProps[]
) => {
  return [
    ...oldData.slice(0, index),
    ...newItem,
    ...oldData.slice(index + newItem?.length),
  ];
};
