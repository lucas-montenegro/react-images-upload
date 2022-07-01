/* eslint-disable prettier/prettier */
import { Box, Button, Stack, useToast } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';

import { api } from '../../services/api';
import { FileInput } from '../Input/FileInput';
import { TextInput } from '../Input/TextInput';

const baseURL = 'http://localhost:3000';

interface FormAddImageProps {
  closeModal: () => void;
}

export function FormAddImage({ closeModal }: FormAddImageProps): JSX.Element {
  const [imageUrl, setImageUrl] = useState('');
  const [localImageUrl, setLocalImageUrl] = useState('');
  const toast = useToast();

  const formValidations = {
    image: {
      required: 'Arquivo obrigatório',
      validate: {
        lessThan10MB: (file) => {         
          const imgSize = file[0].size;
          return imgSize < 10000000 || 'O arquivo deve ser menor que 10MB';
        },  
        acceptedFormats: (file) =>  {
          const imgType = file[0].type;
          const regex = /image\/(jpeg|gif|png)/;
          return regex.test(imgType) || 'Somente são aceitos arquivos PNG, JPEG e GIF'
        }
      } 
    },
    title: {
      required: 'Título obrigatório',
      minLength: { 
        value: 2,
        message: 'Mínimo de 2 caracteres'
      },
      maxLength: {
        value: 20,
        message: 'Máximo de 20 caracteres'
      },
    },
    description: {
      required: 'Descrição obrigatória',
      maxLength: {
        value: 65,
        message: 'Máximo de 65 caracteres',
      }
    },
  };

  const queryClient = useQueryClient();
  const mutation = useMutation(data => {
      const { title, description } = data;

      api.post(`${baseURL}/api/images`, {
        url: imageUrl, 
        title, 
        description 
      })
    }, 
    {
      onSuccess: () => {
        queryClient.invalidateQueries('images');
      }
    }
  );

  const {
    register,
    handleSubmit,
    reset,
    formState,
    setError,
    trigger,
  } = useForm();
  const { errors } = formState;

  const onSubmit = async (data: Record<string, unknown>): Promise<void> => {
    try {
      if (imageUrl === undefined || imageUrl === null) { // check if imageUrl does not exist
        toast({
          title: 'Imagem não adicionada',
          description: 'É preciso adicionar e aguardar o upload de uma imagem antes de realizar o cadastro.',
        });
        return;
      }
      // TODO SHOW ERROR TOAST IF IMAGE URL DOES NOT EXISTS
      
      const response = await mutation.mutateAsync(data);
      console.log(response);
      
      toast({
        title: 'Imagem cadastrada',
        description: 'É preciso adicionar e aguardar o upload de uma imagem antes de realizar o cadastro.',
        status: 'success',
      });
      
    } catch {
      toast({
        title: 'Falha no cadastro',
        description: 'É preciso adicionar e aguardar o upload de uma imagem antes de realizar o cadastro.',
        status: 'success',
      });
    } finally {
      // TODO CLEAN FORM, STATES AND CLOSE MODAL
      reset();

      setImageUrl('');
      setLocalImageUrl('');

      closeModal();
    }
  };

  return (
    <Box as="form" width="100%" onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={4}>
        <FileInput
          setImageUrl={setImageUrl}
          localImageUrl={localImageUrl}
          setLocalImageUrl={setLocalImageUrl}
          setError={setError}
          trigger={trigger}
          name="image"
          // TODO SEND IMAGE ERRORS
          {...register('image', formValidations.image)}
          error={errors.image}
          // TODO REGISTER IMAGE INPUT WITH VALIDATIONS
        />

        <TextInput
          placeholder="Título da imagem..."
          name="title"
          {...register('title', formValidations.title)}
          error={errors.title}
          // TODO SEND TITLE ERRORS
          // TODO REGISTER TITLE INPUT WITH VALIDATIONS
        />

        <TextInput
          placeholder="Descrição da imagem..."
          name="description"
          {...register('description', formValidations.description)}
          error={errors.description}
          // TODO SEND DESCRIPTION ERRORS
          // TODO REGISTER DESCRIPTION INPUT WITH VALIDATIONS
        />
      </Stack>

      <Button
        my={6}
        isLoading={formState.isSubmitting}
        isDisabled={formState.isSubmitting}
        type="submit"
        w="100%"
        py={6}
      >
        Enviar
      </Button>
    </Box>
  );
}
