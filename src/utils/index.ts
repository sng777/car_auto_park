export interface CarProps {
    name?: string;
    img?: string;
  }

export const OnAddingCar = (
  oldData: CarProps[],
  startIndex: number,
  index: number,
  newItem: CarProps[],
  fristPark: boolean
) => {
  const result = fristPark
    ? [
        ...oldData.slice(startIndex, index), // part of the array before the specified index
        ...newItem.map((item) => item), // increment the values of the inserted items
        ...oldData.slice(index),
      ]
    : [
        ...oldData.slice(0, startIndex),
        ...newItem.map((item) => item), // increment the values of the inserted items
        ...oldData.slice(startIndex, index - 1), // part of the array before the specified index
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
    // inserted items
    ...newItem,
    // part of the array after the specified index (excluding the replaced item)
    ...oldData.slice(index + newItem?.length),
  ];
};
