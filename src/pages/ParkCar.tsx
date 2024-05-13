import React, { useState } from "react";
import styled from "styled-components";
import ModalMessage, { ModalForm } from "../components/Modal";
import { OnAddingCar, OnInsertCar } from "../utils";
import { CarProps, MessageProps } from "../interfaces";

const MainComponent = styled.div``;

const ChildComponent = styled.div`
  display: grid;
  grid-template-columns: max-content 300px max-content;
  align-items: center;
  justify-content: center;
  justify-items: center;
  @media (max-width: 1400px) {
    grid-template-columns: 1fr;
    .parkexist1 {
      grid-row: 2;
    }
    .parkAdd {
      grid-row: 1;
    }
    .parkExist2 {
      grid-row: 4;
    }
    .park1 {
      grid-row: 3;
    }
    .parkExist {
      grid-row: 6;
    }
    .park2 {
      grid-row: 5;
    }
  }
`;

const Columns = styled.div<{ $column: number }>`
  width: max-content;
  display: grid;
  grid-template-columns: ${({ $column }) => `repeat(${$column}, 1fr)`};
  gap: 10px;

  & > .title {
    grid-column: span 4;
    text-align: center;
    gap: 10px;
  }
`;

const HeaderText = styled.p`
  font-size: 25px;
  font-weight: 800;
`;

const HeadTitle = styled(HeaderText)`
  text-align: center;
`;

const BoldText = styled.p`
  font-size: 15px;
  font-weight: 800;
`;

const ParkSlot = styled.div`
  padding: 20px;
  border-width: 8px;
  border-style: groove double outset double;
  text-align: center;
  cursor: pointer;
`;

const CarImage = styled.img`
  width: 50px;
  height: 50px;
`;

const AddCar = styled.img`
  width: 30px;
  height: 30px;
  cursor: pointer;
  border: 2px solid #000;
  padding: 20px;
`;

const AutomatedCarParkingSystems: React.FC = () => {
  const parkSpaceAvailable: CarProps[] = Array.from({ length: 32 }, (_) => ({
    name: undefined,
    img: undefined,
  }));

  const [parkData, setParkData] = useState(parkSpaceAvailable || []);
  const [message, setMessage] = useState<MessageProps | undefined>();
  const [openModal, setOpenModal] = useState(false);

  const handleParkingSlot = (number?: string) => {
    if (!number) {
      return setMessage({
        header: "Caution",
        message: "The car's plate number is a requirement.",
      });
    }

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
    }

    const newData: CarProps[] = [
      {
        name: number,
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

      const length = Math.max(endIndex - index, 1);
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

      const length = Math.max(index - firstIndex, 1);
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
    <MainComponent>
      {message && (
        <ModalMessage {...message} onClose={() => setMessage(undefined)} />
      )}
      <ChildComponent>
        <Columns $column={4} className="parkExist1">
          <HeadTitle className="title">Parking lot 1(Exit)</HeadTitle>
          {parkData &&
            parkData.slice(0, 16).map((item, index) => (
              <div key={index}>
                <ParkSlot
                  onClick={() => {
                    handleExistParkFirstSlot(item, index + 4);
                  }}
                >
                  <CarImage
                    src={
                      item?.img ||
                      "https://cdn3.iconfinder.com/data/icons/cosmo-color-navigation/40/parking_2-512.png"
                    }
                  />
                  <p>{item?.name || "Available"}</p>
                </ParkSlot>
              </div>
            ))}
        </Columns>
        <AddCar
          className="parkAdd"
          src={"https://cdn-icons-png.flaticon.com/512/63/63747.png"}
          onClick={() => setOpenModal(true)}
        />
        <Columns $column={4} className="parkExist2">
          <HeadTitle className="title">Parking lot 2(Exit)</HeadTitle>
          {parkData &&
            parkData.slice(16).map((item, index) => {
              return (
                <div key={index + 16}>
                  <ParkSlot
                    onClick={() => {
                      handleExistParkSecondSlot(item, index + 16 + 4);
                    }}
                  >
                    <CarImage
                      src={
                        item?.img ||
                        "https://cdn3.iconfinder.com/data/icons/cosmo-color-navigation/40/parking_2-512.png"
                      }
                    />
                    <p>{item?.name || "Available"}</p>
                  </ParkSlot>
                </div>
              );
            })}
        </Columns>
        <HeaderText className="park1">Parking lot 1</HeaderText>
        <BoldText className="parkExist">Exit from the Parking Lot</BoldText>
        <HeaderText className="park2">Parking lot 2</HeaderText>
      </ChildComponent>

      <ModalForm
        open={openModal}
        onSave={(data) => {
          handleParkingSlot(data);
          setOpenModal(false);
        }}
        onClose={() => {
          setOpenModal(false);
        }}
      />
    </MainComponent>
  );
};

export default AutomatedCarParkingSystems;
