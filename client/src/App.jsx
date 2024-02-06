import { useState } from "react";
import axios from "axios";
import {
  Button,
  Flex,
  HStack,
  Image,
  Input,
  ListItem,
  Text,
  UnorderedList,
  VStack,
  useTheme,
  useToast,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";

const App = () => {
  const toast = useToast();
  const [browsedImagesArray, setBrowsedImagesArray] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [dataUri, setDataUri] = useState(null);
  const [loading, setLoading] = useState(false);

  const [conditionsData, setConditionsData] = useState({});

  const handleMultipleImages = (event) => {
    const files = event.target.files;
    const imageArray = Array.from(files);
    setBrowsedImagesArray(imageArray);
  };
  const handleImageChange = (index) => {
    const selectedImage = browsedImagesArray[index];
    setSelectedImage(selectedImage);

    // Selected image converted into Data URI format:
    if (selectedImage) {
      const reader = new FileReader();
      reader.onload = () => {
        setDataUri(reader.result);
      };
      reader.readAsDataURL(selectedImage);
    }
  };

  const handleUpload = async () => {
    setLoading(true);
    if (!dataUri) {
      setLoading(false);
      toast({
        title: "Please upload an image !",
        variant: "left-accent",
        position: "top",
        isClosable: true,
        duration: 2000,
        status: "error",
      });
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_DISEASE_PREDICTION_MODEL_URL}`,
        { data: [dataUri] }
      );
      if (res.status === 200) {
        // console.log(res.data.data[0]);
        handleOpenAIApiCall(res.data.data[0]);
      }
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  const handleOpenAIApiCall = async (data) => {
    setLoading(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/getDiseaseInformation`,
        {
          disease: data
        });
      if (response) {
        setLoading(false);
        toast({
          title: "Check your result !",
          variant: "left-accent",
          position: "top",
          isClosable: true,
          duration: 2000,
          status: "success",
        });
        setConditionsData(JSON.parse(response.data.responseText));
      }
    } catch (error) {
      setLoading(false);
      toast({
        title: "Sorry, something went wrong !",
        variant: "left-accent",
        position: "top",
        isClosable: true,
        duration: 2000,
        status: "error",
      });
    }
  };

  console.log("conditionsData =>", conditionsData);


  return (
    <VStack w="full" alignItems="center" justifyContent="center" margin="auto" >
      <VStack m="1rem 0" gap="0">
        <Text fontSize="2rem" fontWeight="600">Derma Perdictor</Text>
        <Text fontSize="1rem" fontWeight="500">- AI powered Dermatology Disease Prediction -</Text>
      </VStack>
      <HStack gap="2rem" alignItems="flex-start" w="1200px">

        <Flex flexDir="column" gap="1rem" w="full">

          <label
            htmlFor="imageFile"
            className="custom-imageFile-input-magicWand"
            style={{
              backgroundImage: dataUri ? `url(${dataUri})` : "none",
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              alignItems: "center",
              display: "flex",
              justifyContent: "center",
              margin: "auto",
              border: "1px solid #e4e6ea",
              height: "15rem",
              width: "100%",
              cursor: "pointer",
              borderRadius: "5px",
            }}
          >
            {browsedImagesArray.length === 0 && <Text>Browse Image</Text>}

            <input
              multiple
              hidden
              accept="image/*"
              type="file"
              onChange={(e) => {
                handleMultipleImages(e);
              }}
              id="imageFile"
            />
          </label>
          {browsedImagesArray.length > 0 && (
            <Flex
              flexDir="row"
              gap="1rem"
              borderRadius="5px"
              border="1px solid #e4e6ea"
              p="0.5rem"
              overflowX={browsedImagesArray.length > 3 ? "scroll" : "hidden"}
            >
              {browsedImagesArray.map((image, index) => (
                <Image
                  border={selectedImage === image ? "3px solid #3ce2ad" : "none"}
                  cursor="pointer"
                  onClick={() => handleImageChange(index)}
                  objectFit="cover"
                  borderRadius="5px"
                  height="5rem"
                  width="5rem"
                  key={index}
                  src={URL.createObjectURL(image)}
                  alt={`Selected Image ${index}`}
                  className="uploaded-image"
                />
              ))}
            </Flex>
          )}

          <Button
            onClick={handleUpload}
            isLoading={loading}
            loadingText="Detecting..."
          >Submit</Button>
        </Flex>

        <VStack w="full">


         
          <Flex
            w="full"
            flexDir="column"
            border="1px solid #e4e6ea"
            p="1rem"
            borderRadius="5px"
            gap="0.5rem"
          >
            <Text fontWeight="500">Disease Name</Text>
            <Flex border="1px solid #e4e6ea" p="1rem" borderRadius="5px">
              {loading ? "Detecting..." : (
                <Text>{conditionsData["disease"]}</Text>)}
            </Flex>
          </Flex>
          <Flex
            w="full"
            flexDir="column"
            border="1px solid #e4e6ea"
            p="1rem"
            borderRadius="5px"
            gap="0.5rem"
          >
            <Text fontWeight="500">Communicable</Text>
            <Flex border="1px solid #e4e6ea" p="1rem" borderRadius="5px">
              {loading ? "Detecting..." : (
                <Text>{conditionsData["communicable"]}</Text>)}
            </Flex>
          </Flex>
          <Flex
            w="full"
            flexDir="column"
            border="1px solid #e4e6ea"
            p="1rem"
            borderRadius="5px"
            gap="0.5rem"
          >
            <Text fontWeight="500">External Link</Text>
            <Flex border="1px solid #e4e6ea" p="1rem" borderRadius="5px">
              {loading ? "Detecting..." : (
                 <Text>{conditionsData["external_link"]}</Text>)}
            </Flex>
          </Flex>
          <Flex
            w="full"
            flexDir="column"
            border="1px solid #e4e6ea"
            p="1rem"
            borderRadius="5px"
            gap="0.5rem"
          >
            <Text fontWeight="500">Treatment</Text>
            <Flex border="1px solid #e4e6ea" p="1rem" borderRadius="5px">
              {loading ? "Detecting..." : (
                <UnorderedList>
                  {conditionsData?.treatment?.map((treatment, index) => (
                    <ListItem key={index}>{treatment}</ListItem>
                  ))}
                </UnorderedList>)}
            </Flex>
          </Flex>
          <Flex
            w="full"
            flexDir="column"
            border="1px solid #e4e6ea"
            p="1rem"
            borderRadius="5px"
            gap="0.5rem"
          >
            <Text fontWeight="500">Symptoms</Text>
            <Flex border="1px solid #e4e6ea" p="1rem" borderRadius="5px">
              {loading ? "Detecting..." : (
                <UnorderedList>
                  {conditionsData?.symptoms?.map((symptom, index) => (
                    <ListItem key={index}>{symptom}</ListItem>
                  ))}
                </UnorderedList>)}
            </Flex>
          </Flex>
          <Flex
            w="full"
            flexDir="column"
            border="1px solid #e4e6ea"
            p="1rem"
            borderRadius="5px"
            gap="0.5rem"
          >
            <Text fontWeight="500">Causes</Text>
            <Flex border="1px solid #e4e6ea" p="1rem" borderRadius="5px">
              {loading ? "Detecting..." : (
                <UnorderedList>
                  {conditionsData?.causes?.map((cause, index) => (
                    <ListItem key={index}>{cause}</ListItem>
                  ))}
                </UnorderedList>)}
            </Flex>
          </Flex>
          <Flex
            w="full"
            flexDir="column"
            border="1px solid #e4e6ea"
            p="1rem"
            borderRadius="5px"
            gap="0.5rem"
          >
            <Text fontWeight="500">Treatment</Text>
            <Flex border="1px solid #e4e6ea" p="1rem" borderRadius="5px">
              {loading ? "Detecting..." : (
                <UnorderedList>
                  {conditionsData?.treatment?.map((treatment, index) => (
                    <ListItem key={index}>{treatment}</ListItem>
                  ))}
                </UnorderedList>)}
            </Flex>
          </Flex>

        </VStack>

      </HStack>
    </VStack>
  );
};

export default App;





// import { Button, Flex, Input, Text, VStack } from "@chakra-ui/react"
// import { useState } from "react";
// import axios from "axios";

// function App() {
//   const [disease, setDisease] = useState("");
//   const [result, setResult] = useState({});

//   const handleGetDiseaseInformation = async () => {
//     try {
//       const response = await axios.post("http://localhost:5000/api/getDiseaseInformation", { disease });
//       // console.log("data =>", response.data.responseText);
//       setResult(JSON.parse(response.data.responseText));
//       console.log("data =>", response.data.responseText["Disease"]);
//     } catch (error) {
//       console.error(error);
//     }
//   };
//   console.log("result =>", result);

//   return (
//     <VStack>
//       <Input
//         type="text"
//         value={disease}
//         onChange={(e) => setDisease(e.target.value)}
//       />
//       <Button onClick={handleGetDiseaseInformation}>Get Disease Information</Button>
//       <VStack>
//         <Text>{result?.disease}</Text>
//       </VStack>


//     </VStack>
//   )
// }

// export default App


