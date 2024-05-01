import React, { useState } from "react";
import styled from "styled-components";
import ModalComponent, { MessageProps, ModalForm } from "../components/Modal";
import { CarProps, OnAddingCar, OnInsertCar } from "../utils";

const Component = styled.div`
  display: grid;
  grid-template-columns: max-content 300px max-content;
  align-items: center;
  justify-content: center;
  justify-items: center;
`;

const Columns = styled.div<{ $column: number }>`
  width: max-content;
  display: grid;
  grid-template-columns: ${({ $column }) => `repeat(${$column}, 1fr)`};
  gap: 10px;

  & > .title {
    /* Target the 1st and 5th elements */
    grid-column: span 4; /* Apply grid-column: span 4 */
    text-align: center;
    gap: 10px;
  }
`;

const MainText = styled.p`
  font-size: 25px;
  font-weight: 800;
`;

const HeadTitle = styled(MainText)`
  text-align: center;
`;

const Slot = styled.div`
  padding: 20px;
  border-width: 8px;
  border-style: groove double outset double;
  text-align: center;
  cursor: pointer;
`;

const Image = styled.img`
  width: 50px;
  height: 50px;
`;

const AddComponent = styled.img`
  width: 30px;
  height: 30px;
  cursor: pointer;
  border: 2px solid #000;
  padding: 20px;
`;

export const Input = styled.input`
  border: 1px solid black;
  border-radius: 50px;
  padding: 10px;
  width: 480px;
  &:focus {
    outline: none;
  }
`;

const AutomatedCarParkingSystems: React.FC = () => {
  const parkSpaceAvailable: CarProps[] = Array.from({ length: 32 }, (_) => ({
    name: undefined,
    img: undefined,
  }));

  const [parkData, setParkData] = useState(parkSpaceAvailable || []);
  const [message, setMessage] = useState<MessageProps | undefined>();
  const [open, setOpen] = useState(false);

  const handleParkingSlot = (no?: string) => {
    const parkingLot1 = parkData.slice(0, 4);
    const parkingLot2 = parkData.slice(16, 20);
    let firstIndex = 1;
    let lastIndex = 4;
    let parkLot = parkingLot1;

    if (
      parkingLot1.filter((item) => item.name).length >
      parkingLot2.filter((item) => item.name).length
    ) {
      parkLot = parkingLot2;
      firstIndex = 16;
      lastIndex = 20;
    }

    if (
      (parkLot.filter((item) => item.name).length >= 1 &&
        parkData.slice(4, 8).filter((item) => item.name).length >= 1) ||
      (parkLot.filter((item) => item.name).length >= 1 &&
        parkData.slice(20, 24).filter((item) => item.name).length >= 1)
    ) {
      return setMessage({
        header: "Caution",
        message: "Please leave the all cars!!",
      });
    }

    const checkSpace = parkLot.every((value) => value.name);
    if (checkSpace) {
      return setMessage({
        header: "Caution",
        message: "The parking area was filled to fullness.",
      });
    } else if (!no) {
      return setMessage({
        header: "Caution",
        message: "The car's plate number is a requirement.",
      });
    }

    const newData: CarProps[] = [
      {
        name: no,
        img: "https://icones.pro/wp-content/uploads/2021/03/icone-de-voiture-symbole-png-orange.png",
      },
    ];

    setParkData((preData) => {
      return OnAddingCar(
        preData,
        firstIndex,
        lastIndex,
        newData,
        firstIndex === 1 ? true : false
      );
    });
  };

  const handleExistParkFirstSlot = (item?: CarProps, index?: number) => {
    if (!item?.name || index === undefined) {
      return setMessage({
        header: "Caution",
        message: "It was an empty slot!!",
      });
    } else {
      let endIndex = 4;
      if (index > 11) {
        endIndex = 16;
      } else if (index > 7) {
        endIndex = 12;
      } else if (index > 3) {
        endIndex = 8;
      }

      const newDataParkingSlot = parkData.map((car, carIndex) => {
        if (carIndex > index && carIndex < endIndex) {
          car.name = parkData[endIndex + index - 4 - carIndex]?.name;
          car.img = parkData[endIndex + index - 4 - carIndex]?.img;
        }
        return car;
      });

      const length = Math.max(endIndex - index, 1); // Ensure non-negative length
      const arrange = parkSpaceAvailable
        .slice(0, length)
        .concat(newDataParkingSlot.slice(endIndex - 8, index - 4));
      setParkData(OnInsertCar(newDataParkingSlot, endIndex - 8, arrange));
      setMessage({
        header: "Come Again",
        message: `The car's ${item.name} has been departing.`,
      });
    }
  };

  const handleExistParkSecondSlot = (item?: CarProps, index?: number) => {
    if (!item?.name || index === undefined) {
      return setMessage({
        header: "Caution",
        message: "It was an empty slot!!",
      });
    } else {
      let firstIndex = 19;
      if (index >= 28) {
        firstIndex = 27;
      } else if (index >= 24) {
        firstIndex = 23;
      }

      const newDataParkingSlot = parkData.map((car, carIndex) => {
        if (carIndex > firstIndex && carIndex < index) {
          car.name = parkData[firstIndex + index - (carIndex + 4)]?.name;
          car.img = parkData[firstIndex + index - (carIndex + 4)]?.img;
        }
        return car;
      });

      const length = Math.max(index - firstIndex, 1); // Ensure non-negative length
      const arrange = newDataParkingSlot
        .slice(index - 3, firstIndex + 1)
        .concat(
          parkSpaceAvailable.slice(16, length > 4 ? 16 + 4 : 16 + length)
        );

      setParkData(OnInsertCar(newDataParkingSlot, firstIndex - 3, arrange));
      setMessage({
        header: "Come Again",
        message: `The car's ${item?.name || ""} has been departing.`,
      });
    }
  };

  return (
    <div>
      {message && (
        <ModalComponent {...message} onClose={() => setMessage(undefined)} />
      )}
      <Component>
        <Columns $column={4}>
          <HeadTitle className="title">Parking lot 1(Exit)</HeadTitle>
          {parkData &&
            parkData.slice(0, 16).map((item, index) => (
              <div key={index}>
                <Slot
                  onClick={() => {
                    handleExistParkFirstSlot(item, index + 4);
                  }}
                >
                  <Image
                    src={
                      item?.img ||
                      "https://cdn3.iconfinder.com/data/icons/cosmo-color-navigation/40/parking_2-512.png"
                    }
                  />
                  <p>{item?.name || "Availability"}</p>
                </Slot>
              </div>
            ))}
        </Columns>
        <AddComponent
          src={"https://cdn-icons-png.flaticon.com/512/63/63747.png"}
          onClick={() => setOpen(true)}
        />
        <Columns $column={4}>
          <HeadTitle className="title">Parking lot 2(Exit)</HeadTitle>
          {parkData &&
            parkData.slice(16).map((item, index) => {
              return (
                <div key={index + 16}>
                  <Slot
                    onClick={() => {
                      handleExistParkSecondSlot(item, index + 16 + 4);
                    }}
                  >
                    <Image
                      src={
                        item?.img ||
                        "https://cdn3.iconfinder.com/data/icons/cosmo-color-navigation/40/parking_2-512.png"
                      }
                    />
                    <p>{item?.name || "Availability"}</p>
                  </Slot>
                </div>
              );
            })}
        </Columns>
        <MainText>Parking lot 1</MainText>
        <MainText style={{ fontSize: 15 }}>Exit from the Parking Lot</MainText>
        <MainText>Parking lot 2</MainText>
      </Component>

      <ModalForm
        open={open}
        onClose={(data) => {
          if (data) {
            handleParkingSlot(data);
          }
          setOpen(false);
        }}
      />
    </div>
  );
};

export default AutomatedCarParkingSystems;
