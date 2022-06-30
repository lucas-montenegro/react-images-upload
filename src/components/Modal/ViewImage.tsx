/* eslint-disable prettier/prettier */
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalBody,
  Image,
  Link,
  Img,
} from '@chakra-ui/react';

interface ModalViewImageProps {
  isOpen: boolean;
  onClose: () => void;
  imgUrl: string;
}

export function ModalViewImage({
  isOpen,
  onClose,
  imgUrl,
}: ModalViewImageProps): JSX.Element {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent maxW="900px" maxH="632px" w="fit-content" h="fit-content">
          <ModalBody p="0">
            <Img src={imgUrl} alt='Image' w="100%" h="100%" /> 
          </ModalBody>

          <ModalFooter w="100%" h={8} bgColor="pGray.800" justifyContent="flex-start">
           <Link href={imgUrl} fontSize="sm" h={4}>
              Abrir original
           </Link>
          </ModalFooter>
        </ModalContent>
      </Modal>
  )
}
