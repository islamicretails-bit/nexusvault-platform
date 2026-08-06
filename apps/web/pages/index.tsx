import React from 'react';
import Head from 'next/head';
import { GetStaticProps } from 'next';
import { dehydrate, QueryClient, useQuery } from '@tanstack/react-query';
import { fetchNexusVaultData } from '../lib/api';
import NexusVaultLayout from '../components/NexusVaultLayout';
import HeroSection from '../components/HeroSection';
import FeaturesSection from '../components/FeaturesSection';
import CallToActionSection from '../components/CallToActionSection';

export const getStaticProps: GetStaticProps = async () => {
  const queryClient = new QueryClient();
  await queryClient.fetchQuery('nexusVaultData', fetchNexusVaultData);
  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

const HomePage = () => {
  const { data, error, isLoading } = useQuery(['nexusVaultData'], fetchNexusVaultData);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <NexusVaultLayout>
      <Head>
        <title>Nexus Vault Platform</title>
        <meta name="description" content="Nexus Vault Platform" />
      </Head>
      <HeroSection data={data} />
      <FeaturesSection data={data} />
      <CallToActionSection data={data} />
    </NexusVaultLayout>
  );
};

export default HomePage;