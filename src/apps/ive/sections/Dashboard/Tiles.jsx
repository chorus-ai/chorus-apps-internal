import React, { useState } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import { Resizable } from "react-resizable";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import Tile1 from "./Tile1";
import Tile2 from "./Tile2";
import Tile3 from "./Tile3";
import Tile4 from "./Tile4";
import Tile6 from "./Tile6";

const ResponsiveGridLayout = WidthProvider(Responsive);

const MyFirstGrid = ({disabled}) => {
  const [layout, setLayout] = useState(
   [
    {
        "w": 4,
        "h": 11,
        "x": 0,
        "y": 6,
        "i": "b",
        "moved": false,
        "static": false
    },
    {
        "w": 10,
        "h": 6,
        "x": 2,
        "y": 0,
        "i": "c",
        "moved": false,
        "static": false
    },
    {
        "w": 12,
        "h": 12,
        "x": 0,
        "y": 17,
        "i": "a",
        "moved": false,
        "static": false
    },
    {
        "w": 2,
        "h": 6,
        "x": 0,
        "y": 0,
        "i": "d",
        "moved": false,
        "static": false
    },
    {
        "w": 8,
        "h": 11,
        "x": 4,
        "y": 6,
        "i": "e",
        "moved": false,
        "static": false
    }
]
  );


  const handleLayoutChange = (newLayout) => {
    console.log("newLayout", newLayout);
    setLayout(newLayout);
  };

  const generateLayout = () => {
    return layout.map((item) => ({
      ...item,
      x: item.x,
      y: item.y,
      w: item.w,
      h: item.h
    }));
  };

  const resizableComponents = layout.map((item) => {
    console.log('item', item);
    return (    <div key={item.i}>
      {item.i === "a" && (
        <Resizable
          className="resizable"
          width={item.w * 100}
          height={item.h * 30}
          minConstraints={[1, 1]}
          maxConstraints={[4, 4]}
          onResize={(e, { size }) => {

    console.log('size', size);
            const newLayout = layout.map((l) =>
              l.i === "a" ? { ...l, w: size.width / 100, h: size.height / 30 } : l
            );


            handleLayoutChange(newLayout);
          }}
        >
          <div style={{ width: "100%", height: "100%" }}>
          <Tile6/>
          </div>
        </Resizable>
      )}
      {item.i === "b" && (
        <Resizable
          className="resizable"
          width={item.w * 100}
          height={item.h * 30}
          minConstraints={[2, 1]}
          maxConstraints={[4, 4]}
          onResize={(e, { size }) => {
            console.log(size )
            const newLayout = layout.map((l) =>
              l.i === "b" ? { ...l, w: size.width / 100, h: size.height / 30 } : l
            );
            handleLayoutChange(newLayout);
          }}
        >
          <div style={{ width: "100%", height: "100%" }}>
            <Tile2 />
          </div>
        </Resizable>
      )}
      {item.i === "c" && (
        <Resizable
          className="resizable"
          width={item.w * 100}
          height={item.h * 30}
          minConstraints={[1, 1]}
          maxConstraints={[4, 4]}
          onResize={(e, { size }) => {
            const newLayout = layout.map((l) =>
              l.i === "c" ? { ...l, w: size.width / 100, h: size.height / 30 } : l
            );

            handleLayoutChange(newLayout);
          }}
        >
          <div style={{ width: "100%", height: "100%" }}>
            <Tile1 />
          </div>
        </Resizable>
      )}
      {item.i === "d" && (
          <Resizable
            className="resizable"
            width={item.w * 100}
            height={item.h * 30}
            minConstraints={[1, 1]}
            maxConstraints={[4, 4]}
            onResize={(e, { size }) => {
              const newLayout = layout.map((l) =>
                l.i === "d" ? { ...l, w: size.width / 100, h: size.height / 30 } : l
              );

              handleLayoutChange(newLayout);
            }}
          >
            <div style={{ width: "100%", height: "100%" }}>
              <Tile3 />
            </div>
          </Resizable>
        )}
        {item.i === "e" && (
          <Resizable
            className="resizable"
            width={item.w * 100}
            height={item.h * 30}
            minConstraints={[1, 1]}
            maxConstraints={[4, 4]}
            onResize={(e, { size }) => {
              const newLayout = layout.map((l) =>
                l.i === "e" ? { ...l, w: size.width / 100, h: size.height / 30 } : l
              );

              handleLayoutChange(newLayout);
            }}
          >
            <div style={{ width: "100%", height: "100%" }}>
              <Tile4 />
            </div>
          </Resizable>
        )}
    </div> );

 
});

  console.log('layout', layout)
  return (
    <ResponsiveGridLayout
      className="layout"
      layouts={{ lg: generateLayout() }}
      cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
      breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
      rowHeight={30}
      isDraggable={disabled}
      isResizable={disabled}
      onResize={(layout, oldItem, newItem) => {
        // Add a console.log statement here to check if the onResize event is being triggered.
        console.log("onResize", layout, oldItem, newItem);
      }}
    >
      {resizableComponents}
    </ResponsiveGridLayout>
  );
};

export default MyFirstGrid;
