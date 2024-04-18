// import { useEffect, useState } from "react";
// // import Highlighter from "react-highlight-words";

import { MdOutlineSpatialTracking } from "react-icons/md";
import { LazyLoadImage } from "react-lazy-load-image-component";

// function Test() {
//   const [s, setS] = useState<string[]>(["cat"]);
//   const handleClick = () => {
//     setS((prev) => [...prev, "just"]);
//   };

//   const [d, setD] =
//     useState<{ id: number; text: string; isCorrect: boolean }[]>();

//   const [w, setW] =
//     useState<{ id: number; text: string; isCorrect: boolean }[]>();
//   const [count, setCount] = useState<number>(0);

//   useEffect(() => {
//     const t = setInterval(() => {
//       if (w) {
//         const d = document.getElementById(w[count].id.toString());
//         if (d) {
//           d.classList.add("text-red-500");
//           d.classList.add("font-bold");
//         }
//         setCount((prev) => (prev + 1) % w.length);
//       }
//     }, 111);
//     return () => clearInterval(t);
//   }, [w, count]);

//   useEffect(() => {
//     const m = [
//       {
//         id: 190582,
//         text: "Lorem",
//         isCorrect: false,
//       },

//       {
//         id: 616366,
//         text: "ipsum",
//         isCorrect: false,
//       },

//       {
//         id: 858890,
//         text: "dolor",
//         isCorrect: false,
//       },

//       {
//         id: 143270,
//         text: "sit",
//         isCorrect: true,
//       },

//       {
//         id: 289478,
//         text: "amet",
//         isCorrect: false,
//       },

//       {
//         id: 592121,
//         text: "consectetur",
//         isCorrect: true,
//       },

//       {
//         id: 612904,
//         text: "adipisicing",
//         isCorrect: true,
//       },

//       {
//         id: 255769,
//         text: "elit.",
//         isCorrect: true,
//       },

//       {
//         id: 289635,
//         text: "Aperiam",
//         isCorrect: true,
//       },

//       {
//         id: 639722,
//         text: "sint",
//         isCorrect: false,
//       },

//       {
//         id: 610466,
//         text: "ad",
//         isCorrect: false,
//       },

//       {
//         id: 159733,
//         text: "officiis",
//         isCorrect: true,
//       },

//       {
//         id: 425668,
//         text: "qui",
//         isCorrect: false,
//       },

//       {
//         id: 448154,
//         text: "quia",
//         isCorrect: false,
//       },

//       {
//         id: 507125,
//         text: "totam",
//         isCorrect: false,
//       },

//       {
//         id: 214871,
//         text: "veniam",
//         isCorrect: true,
//       },

//       {
//         id: 957218,
//         text: "officia",
//         isCorrect: true,
//       },

//       {
//         id: 880963,
//         text: "sunt",
//         isCorrect: true,
//       },

//       {
//         id: 237689,
//         text: "dolor,",
//         isCorrect: true,
//       },

//       {
//         id: 694220,
//         text: "iste",
//         isCorrect: true,
//       },

//       {
//         id: 764422,
//         text: "quos",
//         isCorrect: true,
//       },

//       {
//         id: 543947,
//         text: "sit",
//         isCorrect: true,
//       },

//       {
//         id: 559028,
//         text: "incidunt",
//         isCorrect: true,
//       },

//       {
//         id: 485221,
//         text: "consectetur",
//         isCorrect: true,
//       },

//       {
//         id: 616424,
//         text: "ab",
//         isCorrect: true,
//       },

//       {
//         id: 420192,
//         text: "dolore",
//         isCorrect: true,
//       },

//       {
//         id: 792220,
//         text: "repellendus",
//         isCorrect: false,
//       },

//       {
//         id: 980928,
//         text: "et",
//         isCorrect: true,
//       },

//       {
//         id: 457338,
//         text: "voluptas",
//         isCorrect: true,
//       },

//       {
//         id: 538947,
//         text: "dolores",
//         isCorrect: true,
//       },

//       {
//         id: 508362,
//         text: "eius",
//         isCorrect: true,
//       },

//       {
//         id: 718740,
//         text: "itaque",
//         isCorrect: false,
//       },

//       {
//         id: 114649,
//         text: "doloremque",
//         isCorrect: true,
//       },

//       {
//         id: 880067,
//         text: "a",
//         isCorrect: true,
//       },

//       {
//         id: 509937,
//         text: "deserunt",
//         isCorrect: true,
//       },

//       {
//         id: 478181,
//         text: "porro.",
//         isCorrect: false,
//       },

//       {
//         id: 153682,
//         text: "Similique,",
//         isCorrect: false,
//       },

//       {
//         id: 364933,
//         text: "recusandae",
//         isCorrect: false,
//       },

//       {
//         id: 916021,
//         text: "ipsam!",
//         isCorrect: true,
//       },

//       {
//         id: 563104,
//         text: "Quod",
//         isCorrect: false,
//       },

//       {
//         id: 732765,
//         text: "iusto",
//         isCorrect: false,
//       },

//       {
//         id: 712860,
//         text: "repudiandae",
//         isCorrect: true,
//       },

//       {
//         id: 947625,
//         text: "commodi",
//         isCorrect: false,
//       },

//       {
//         id: 199969,
//         text: "totam",
//         isCorrect: true,
//       },

//       {
//         id: 578665,
//         text: "reiciendis",
//         isCorrect: true,
//       },

//       {
//         id: 697156,
//         text: "ipsam",
//         isCorrect: true,
//       },

//       {
//         id: 707571,
//         text: "ratione",
//         isCorrect: true,
//       },

//       {
//         id: 621675,
//         text: "animi,",
//         isCorrect: true,
//       },

//       {
//         id: 615585,
//         text: "veritatis,",
//         isCorrect: true,
//       },

//       {
//         id: 898632,
//         text: "praesentium",
//         isCorrect: true,
//       },

//       {
//         id: 848748,
//         text: "autem",
//         isCorrect: true,
//       },

//       {
//         id: 779887,
//         text: "quos",
//         isCorrect: true,
//       },

//       {
//         id: 510005,
//         text: "est",
//         isCorrect: true,
//       },

//       {
//         id: 658524,
//         text: "tempore",
//         isCorrect: true,
//       },

//       {
//         id: 906049,
//         text: "provident",
//         isCorrect: true,
//       },

//       {
//         id: 109472,
//         text: "eaque",
//         isCorrect: false,
//       },

//       {
//         id: 462550,
//         text: "inventore",
//         isCorrect: false,
//       },

//       {
//         id: 846436,
//         text: "id",
//         isCorrect: false,
//       },

//       {
//         id: 808824,
//         text: "dolor",
//         isCorrect: true,
//       },

//       {
//         id: 185341,
//         text: "atque",
//         isCorrect: false,
//       },

//       {
//         id: 158541,
//         text: "nulla",
//         isCorrect: true,
//       },

//       {
//         id: 344131,
//         text: "veniam",
//         isCorrect: true,
//       },

//       {
//         id: 645621,
//         text: "impedit",
//         isCorrect: false,
//       },

//       {
//         id: 538044,
//         text: "ea",
//         isCorrect: false,
//       },

//       {
//         id: 954608,
//         text: "iure",
//         isCorrect: true,
//       },

//       {
//         id: 928302,
//         text: "consequuntur?",
//         isCorrect: true,
//       },

//       {
//         id: 707070,
//         text: "Dolorem,",
//         isCorrect: false,
//       },

//       {
//         id: 281242,
//         text: "assumenda",
//         isCorrect: true,
//       },

//       {
//         id: 654390,
//         text: "sit",
//         isCorrect: false,
//       },

//       {
//         id: 806695,
//         text: "eaque",
//         isCorrect: true,
//       },

//       {
//         id: 689687,
//         text: "nobis",
//         isCorrect: false,
//       },

//       {
//         id: 916670,
//         text: "voluptates",
//         isCorrect: true,
//       },

//       {
//         id: 715559,
//         text: "eius",
//         isCorrect: true,
//       },

//       {
//         id: 299900,
//         text: "rerum",
//         isCorrect: true,
//       },

//       {
//         id: 734747,
//         text: "a",
//         isCorrect: false,
//       },

//       {
//         id: 110028,
//         text: "odio",
//         isCorrect: true,
//       },

//       {
//         id: 161163,
//         text: "beatae",
//         isCorrect: true,
//       },

//       {
//         id: 584076,
//         text: "iure",
//         isCorrect: true,
//       },

//       {
//         id: 296906,
//         text: "voluptate",
//         isCorrect: true,
//       },

//       {
//         id: 828848,
//         text: "non",
//         isCorrect: true,
//       },

//       {
//         id: 460963,
//         text: "rem",
//         isCorrect: false,
//       },

//       {
//         id: 651391,
//         text: "molestiae",
//         isCorrect: true,
//       },

//       {
//         id: 888781,
//         text: "doloribus",
//         isCorrect: true,
//       },

//       {
//         id: 586935,
//         text: "odit",
//         isCorrect: true,
//       },

//       {
//         id: 833716,
//         text: "libero",
//         isCorrect: false,
//       },

//       {
//         id: 152419,
//         text: "maiores",
//         isCorrect: true,
//       },

//       {
//         id: 400704,
//         text: "recusandae",
//         isCorrect: true,
//       },

//       {
//         id: 265606,
//         text: "magni",
//         isCorrect: false,
//       },

//       {
//         id: 741076,
//         text: "blanditiis",
//         isCorrect: true,
//       },

//       {
//         id: 834815,
//         text: "quas",
//         isCorrect: true,
//       },

//       {
//         id: 643887,
//         text: "modi!",
//         isCorrect: true,
//       },

//       {
//         id: 954059,
//         text: "Rerum",
//         isCorrect: false,
//       },

//       {
//         id: 222785,
//         text: "nulla,",
//         isCorrect: false,
//       },

//       {
//         id: 499336,
//         text: "nemo",
//         isCorrect: true,
//       },

//       {
//         id: 407799,
//         text: "tempore",
//         isCorrect: true,
//       },

//       {
//         id: 522022,
//         text: "temporibus",
//         isCorrect: true,
//       },

//       {
//         id: 666928,
//         text: "veniam",
//         isCorrect: true,
//       },

//       {
//         id: 811658,
//         text: "blanditiis",
//         isCorrect: false,
//       },

//       {
//         id: 133871,
//         text: "illo",
//         isCorrect: true,
//       },

//       {
//         id: 632895,
//         text: "cupiditate",
//         isCorrect: true,
//       },

//       {
//         id: 949839,
//         text: "velit",
//         isCorrect: true,
//       },

//       {
//         id: 107081,
//         text: "quod",
//         isCorrect: false,
//       },

//       {
//         id: 642224,
//         text: "corporis",
//         isCorrect: true,
//       },

//       {
//         id: 833407,
//         text: "adipisci",
//         isCorrect: false,
//       },

//       {
//         id: 931675,
//         text: "veritatis",
//         isCorrect: false,
//       },

//       {
//         id: 616530,
//         text: "aliquid",
//         isCorrect: true,
//       },

//       {
//         id: 702112,
//         text: "ab",
//         isCorrect: true,
//       },

//       {
//         id: 914546,
//         text: "porro,",
//         isCorrect: false,
//       },

//       {
//         id: 294535,
//         text: "necessitatibus",
//         isCorrect: true,
//       },

//       {
//         id: 535132,
//         text: "facilis",
//         isCorrect: false,
//       },

//       {
//         id: 706219,
//         text: "minus",
//         isCorrect: true,
//       },

//       {
//         id: 626818,
//         text: "expedita",
//         isCorrect: true,
//       },

//       {
//         id: 516255,
//         text: "a",
//         isCorrect: false,
//       },

//       {
//         id: 955375,
//         text: "nihil",
//         isCorrect: true,
//       },

//       {
//         id: 903867,
//         text: "id",
//         isCorrect: false,
//       },

//       {
//         id: 671405,
//         text: "mollitia",
//         isCorrect: true,
//       },

//       {
//         id: 107102,
//         text: "magni",
//         isCorrect: false,
//       },

//       {
//         id: 419802,
//         text: "esse",
//         isCorrect: false,
//       },

//       {
//         id: 114055,
//         text: "quis",
//         isCorrect: true,
//       },

//       {
//         id: 986744,
//         text: "aut?",
//         isCorrect: true,
//       },

//       {
//         id: 962685,
//         text: "Ipsa",
//         isCorrect: true,
//       },

//       {
//         id: 660863,
//         text: "numquam",
//         isCorrect: false,
//       },

//       {
//         id: 273698,
//         text: "perspiciatis,",
//         isCorrect: false,
//       },

//       {
//         id: 685400,
//         text: "ex",
//         isCorrect: true,
//       },

//       {
//         id: 557994,
//         text: "qui",
//         isCorrect: true,
//       },

//       {
//         id: 269756,
//         text: "eum",
//         isCorrect: true,
//       },

//       {
//         id: 860310,
//         text: "voluptatibus",
//         isCorrect: true,
//       },

//       {
//         id: 790246,
//         text: "nostrum",
//         isCorrect: true,
//       },

//       {
//         id: 519671,
//         text: "temporibus",
//         isCorrect: true,
//       },

//       {
//         id: 207374,
//         text: "quisquam",
//         isCorrect: false,
//       },

//       {
//         id: 536530,
//         text: "harum",
//         isCorrect: true,
//       },

//       {
//         id: 529588,
//         text: "nam!",
//         isCorrect: true,
//       },

//       {
//         id: 882982,
//         text: "Consequatur",
//         isCorrect: true,
//       },

//       {
//         id: 478141,
//         text: "quaerat",
//         isCorrect: true,
//       },

//       {
//         id: 515024,
//         text: "officia",
//         isCorrect: true,
//       },

//       {
//         id: 414129,
//         text: "culpa",
//         isCorrect: false,
//       },

//       {
//         id: 834128,
//         text: "ratione",
//         isCorrect: true,
//       },

//       {
//         id: 834185,
//         text: "temporibus",
//         isCorrect: false,
//       },

//       {
//         id: 127808,
//         text: "explicabo",
//         isCorrect: true,
//       },

//       {
//         id: 480279,
//         text: "labore",
//         isCorrect: true,
//       },

//       {
//         id: 476713,
//         text: "provident",
//         isCorrect: true,
//       },

//       {
//         id: 654125,
//         text: "deserunt",
//         isCorrect: false,
//       },

//       {
//         id: 660330,
//         text: "sunt.",
//         isCorrect: false,
//       },

//       {
//         id: 835153,
//         text: "Possimus",
//         isCorrect: false,
//       },

//       {
//         id: 937296,
//         text: "laboriosam",
//         isCorrect: true,
//       },

//       {
//         id: 303880,
//         text: "ad",
//         isCorrect: false,
//       },

//       {
//         id: 128459,
//         text: "et",
//         isCorrect: false,
//       },

//       {
//         id: 512066,
//         text: "dignissimos",
//         isCorrect: false,
//       },

//       {
//         id: 694378,
//         text: "commodi,",
//         isCorrect: false,
//       },

//       {
//         id: 469417,
//         text: "quibusdam,",
//         isCorrect: true,
//       },

//       {
//         id: 483205,
//         text: "sit",
//         isCorrect: true,
//       },

//       {
//         id: 539261,
//         text: "at",
//         isCorrect: true,
//       },

//       {
//         id: 404732,
//         text: "necessitatibus",
//         isCorrect: true,
//       },

//       {
//         id: 481624,
//         text: "quia",
//         isCorrect: true,
//       },

//       {
//         id: 919598,
//         text: "qui",
//         isCorrect: true,
//       },

//       {
//         id: 918396,
//         text: "doloribus",
//         isCorrect: false,
//       },

//       {
//         id: 177276,
//         text: "architecto!",
//         isCorrect: true,
//       },

//       {
//         id: 865574,
//         text: "Perspiciatis",
//         isCorrect: true,
//       },

//       {
//         id: 109426,
//         text: "pariatur",
//         isCorrect: false,
//       },

//       {
//         id: 476173,
//         text: "quod",
//         isCorrect: true,
//       },

//       {
//         id: 203732,
//         text: "sint",
//         isCorrect: true,
//       },

//       {
//         id: 638881,
//         text: "modi",
//         isCorrect: true,
//       },

//       {
//         id: 772144,
//         text: "veniam",
//         isCorrect: true,
//       },

//       {
//         id: 662872,
//         text: "harum,",
//         isCorrect: true,
//       },

//       {
//         id: 359376,
//         text: "enim",
//         isCorrect: false,
//       },

//       {
//         id: 967683,
//         text: "in",
//         isCorrect: true,
//       },

//       {
//         id: 736859,
//         text: "cumque",
//         isCorrect: false,
//       },

//       {
//         id: 746871,
//         text: "quidem",
//         isCorrect: true,
//       },

//       {
//         id: 471130,
//         text: "dolor",
//         isCorrect: true,
//       },

//       {
//         id: 839357,
//         text: "odio,",
//         isCorrect: true,
//       },

//       {
//         id: 565219,
//         text: "asperiores",
//         isCorrect: true,
//       },

//       {
//         id: 623348,
//         text: "totam",
//         isCorrect: true,
//       },

//       {
//         id: 481177,
//         text: "vitae",
//         isCorrect: false,
//       },

//       {
//         id: 237620,
//         text: "sed",
//         isCorrect: false,
//       },

//       {
//         id: 260133,
//         text: "molestias",
//         isCorrect: true,
//       },

//       {
//         id: 625906,
//         text: "repellendus",
//         isCorrect: true,
//       },

//       {
//         id: 398092,
//         text: "quaerat",
//         isCorrect: true,
//       },

//       {
//         id: 754451,
//         text: "non",
//         isCorrect: false,
//       },

//       {
//         id: 293633,
//         text: "voluptates.",
//         isCorrect: false,
//       },

//       {
//         id: 492994,
//         text: "Repudiandae",
//         isCorrect: true,
//       },

//       {
//         id: 424850,
//         text: "quas",
//         isCorrect: false,
//       },

//       {
//         id: 365356,
//         text: "perspiciatis",
//         isCorrect: true,
//       },

//       {
//         id: 199360,
//         text: "quisquam",
//         isCorrect: true,
//       },

//       {
//         id: 412300,
//         text: "est.",
//         isCorrect: true,
//       },

//       {
//         id: 594893,
//         text: "Debitis",
//         isCorrect: true,
//       },

//       {
//         id: 685257,
//         text: "in",
//         isCorrect: true,
//       },

//       {
//         id: 535399,
//         text: "similique",
//         isCorrect: true,
//       },

//       {
//         id: 860680,
//         text: "atque",
//         isCorrect: false,
//       },

//       {
//         id: 964276,
//         text: "odit",
//         isCorrect: true,
//       },

//       {
//         id: 240107,
//         text: "voluptatibus!",
//         isCorrect: false,
//       },

//       {
//         id: 833095,
//         text: "Voluptas",
//         isCorrect: true,
//       },

//       {
//         id: 988906,
//         text: "quidem",
//         isCorrect: false,
//       },

//       {
//         id: 916117,
//         text: "obcaecati",
//         isCorrect: true,
//       },

//       {
//         id: 275281,
//         text: "optio",
//         isCorrect: true,
//       },

//       {
//         id: 368437,
//         text: "porro",
//         isCorrect: true,
//       },

//       {
//         id: 950802,
//         text: "doloribus",
//         isCorrect: false,
//       },

//       {
//         id: 282370,
//         text: "repellendus",
//         isCorrect: true,
//       },

//       {
//         id: 116635,
//         text: "delectus",
//         isCorrect: true,
//       },

//       {
//         id: 459455,
//         text: "vero",
//         isCorrect: false,
//       },

//       {
//         id: 817134,
//         text: "sed!",
//         isCorrect: true,
//       },
//     ];

//     const sm = m.filter((a) => a.isCorrect !== true);
//     setD(m);
//     setW(sm);
//   }, []);

//   return (
//     <>
//       {/* <Highlighter
//         highlightClassName="YourHighlightClass"
//         searchWords={s}
//         className=" hidden"
//         autoEscape={true}
//         textToHighlight="The dog is chasing the cat. Or perhaps they're just just playing?"
//       /> */}

//       <button className=" hidden bg-red-500" onClick={handleClick}>
//         Focus
//       </button>

//       <br />
//       <br />

//       {d &&
//         d.length > 0 &&
//         d.map((el) => (
//           <span
//             className="  text-xl transition-all duration-500"
//             key={el.id}
//             id={el.id.toString()}
//           >
//             {el.text}{" "}
//           </span>
//         ))}
//       <br />
//       <button className=" hidden bg-red-500">Focus</button>
//     </>
//   );
// }

// export default Test;

export default function Test() {
  return (
    <div className="px-[5dvw] py-[7dvh]">
      <div className="flex animate-fade-down w-full  bg-black/15 rounded-2xl  justify-between items-center p-2.5 space-x-1.5 pr-3">
        <div className=" flex items-center space-x-1.5">
          <div>
            <LazyLoadImage
              alt="user"
              className=" rounded-full"
              src={"/newfavicon.jpg"}
              width={50}
              height={50}
              loading="lazy"
            />
          </div>
          <div className=" flex flex-col items-start">
            <h2 className="font-semibold capitalize tracking-tight leading-tight max-md:max-w-[30dvw] truncate ">
              Babyo7_
            </h2>
            <div className="flex text-sm space-x-1 leading-tight tracking-tight items-center">
              <h1 className="font-medium leading-tight tracking-tight">
                Send me Tracks
              </h1>
            </div>
          </div>
        </div>
        <div className="flex text-xl space-x-1.5 items-center">
          <MdOutlineSpatialTracking className="h-7 w-7" />
        </div>
      </div>
    </div>
  );
}
