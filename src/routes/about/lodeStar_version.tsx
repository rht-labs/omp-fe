import React from 'react';
import { Grid, GridItem, Text } from '@patternfly/react-core';

interface LodeStarVersionProps {
  versionContext: any;
}

export function LodeStarVersion(props: LodeStarVersionProps) {

  function lodeStar() {
    if (!!props.versionContext?.versions?.versions?.main_version) {
      return props.versionContext?.versions?.versions?.main_version;
    }
    else
      return ''
  };

  return (
    <>
      <Grid lg={6} md={12}>
        <GridItem lg={2} md={6}>
          <b>LodeStar version: </b>
        </GridItem>
        <GridItem lg={2} md={6}>
          <Text data-cy="lodestar_version">{lodeStar()?.value}</Text>
        </GridItem>
      </Grid>
    </>
  );
}

