/* eslint-disable prettier/prettier */
import { SimpleGrid, useDisclosure } from '@chakra-ui/react';
import { useState } from 'react';
import { Card } from './Card';
import { ModalViewImage } from './Modal/ViewImage';

interface Card {
  title: string;
  description: string;
  url: string;
  ts: number;
  id: string;
}

interface CardsProps {
  cards: Card[];
}

export function CardList({ cards }: CardsProps): JSX.Element {
  // TODO MODAL USEDISCLOSURE
  const { isOpen, onOpen, onClose } = useDisclosure();

  // TODO SELECTED IMAGE URL STATE
  const [selectedURL, setSelectedURL] = useState(null);

  // TODO FUNCTION HANDLE VIEW IMAGE
  function handleViewImage(url: string): void {
    setSelectedURL(url);
    onOpen();
  }

  return (
    <>
      <SimpleGrid columns={3} spacing={10}>
        { cards.map((card) => 
            <Card 
              key={card.id}
              data={{
                title: card.title,
                description: card.description,
                url: card.url,
                ts: card.ts,
              }} 
              viewImage={handleViewImage} 
            />
          )
        }
      </SimpleGrid>

      {/* TODO MODALVIEWIMAGE */}
      <ModalViewImage 
        isOpen={isOpen}
        onClose={onClose}
        imgUrl={selectedURL} 
      />
    </>
  );
}
