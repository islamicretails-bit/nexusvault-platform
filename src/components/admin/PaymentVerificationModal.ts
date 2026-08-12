// src/components/admin/PaymentVerificationModal.ts
import React, { useState, useEffect } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Button, Input, Textarea, Select } from '@chakra-ui/react';
import { useToast } from '@chakra-ui/react';
import { PaymentReceipt } from '@prisma/client';
import { prisma } from '../../lib/prisma';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const paymentVerificationSchema = z.object({
  paymentMethod: z.string().min(1, 'Payment method is required'),
  paymentDate: z.date('Payment date is required'),
  paymentAmount: z.number('Payment amount is required'),
  paymentReceipt: z.string().min(1, 'Payment receipt is required'),
});

interface PaymentVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  paymentReceipt: PaymentReceipt | null;
}

const PaymentVerificationModal: React.FC<PaymentVerificationModalProps> = ({ isOpen, onClose, paymentReceipt }) => {
  const toast = useToast();
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(paymentVerificationSchema),
    defaultValues: {
      paymentMethod: paymentReceipt?.paymentMethod || '',
      paymentDate: paymentReceipt?.paymentDate || '',
      paymentAmount: paymentReceipt?.paymentAmount || 0,
      paymentReceipt: paymentReceipt?.paymentReceipt || '',
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      if (paymentReceipt) {
        await prisma.paymentReceipt.update({
          where: { id: paymentReceipt.id },
          data: {
            paymentMethod: data.paymentMethod,
            paymentDate: data.paymentDate,
            paymentAmount: data.paymentAmount,
            paymentReceipt: data.paymentReceipt,
            status: 'VERIFIED',
          },
        });
      } else {
        await prisma.paymentReceipt.create({
          data: {
            paymentMethod: data.paymentMethod,
            paymentDate: data.paymentDate,
            paymentAmount: data.paymentAmount,
            paymentReceipt: data.paymentReceipt,
            status: 'VERIFIED',
          },
        });
      }
      toast({
        title: 'Payment verified successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onClose();
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error verifying payment',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Payment Verification</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Input
              type="text"
              placeholder="Payment Method"
              {...register('paymentMethod')}
              isInvalid={errors.paymentMethod ? true : false}
            />
            {errors.paymentMethod && <div>{errors.paymentMethod.message}</div>}
            <Input
              type="date"
              placeholder="Payment Date"
              {...register('paymentDate')}
              isInvalid={errors.paymentDate ? true : false}
            />
            {errors.paymentDate && <div>{errors.paymentDate.message}</div>}
            <Input
              type="number"
              placeholder="Payment Amount"
              {...register('paymentAmount')}
              isInvalid={errors.paymentAmount ? true : false}
            />
            {errors.paymentAmount && <div>{errors.paymentAmount.message}</div>}
            <Textarea
              placeholder="Payment Receipt"
              {...register('paymentReceipt')}
              isInvalid={errors.paymentReceipt ? true : false}
            />
            {errors.paymentReceipt && <div>{errors.paymentReceipt.message}</div>}
            <Select {...register('status')}>
              <option value="PENDING">Pending</option>
              <option value="VERIFIED">Verified</option>
            </Select>
            <Button type="submit" isLoading={isSubmitting} colorScheme="blue" mt={4}>
              Verify Payment
            </Button>
          </form>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default PaymentVerificationModal;