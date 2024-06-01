// import { useCallback, useEffect, useState } from "react";

// function useSpeech() {
//   const [rec, setRec] = useState<unknown>();
//   const startListening = useCallback(() => {
//     if (rec) {
//       console.log("started");
//       rec.start();
//     }
//   }, [rec]);

//   const stopListening = useCallback(() => {
//     if (rec) {
//       console.log("stopped");
//       rec.stop();
//     }
//   }, [rec]);

//   const handleResult = useCallback((e: SpeechRecognitionEvent) => {
//     for (let i = 0; i < e.results.length; i++) {
//       const transcript = e.results[i][0].transcript;
//       console.log(transcript);
//     }
//   }, []);

//   return { startListening, stopListening };
// }

// export default useSpeech;
