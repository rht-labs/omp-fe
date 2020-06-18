import React from 'react';
import {
  Card,
  CardBody,
  CardTitle,
  Title,
  Level,
  LevelItem,
  Button,
  ButtonVariant,
} from '@patternfly/react-core';
import { Feature } from '../../components/feature';
import { APP_FEATURES } from '../../common/app_features';
import { Link } from 'react-router-dom';
export interface DataCardProps {
  title: string;
  children: any;
  isEditable?: boolean;
  onEdit?: () => void;
}

export function DataCard({
  children,
  title,
  isEditable = false,
  onEdit = () => {},
}: DataCardProps) {
  return (
    <Card>
      <CardTitle>
        <Level>
          <LevelItem>
            <Title headingLevel="h3" style={{ fontWeight: 'normal' }}>
              {title}
            </Title>
          </LevelItem>
          <LevelItem>
            <Feature name={APP_FEATURES.writer}>
              <EditButton onClick={onEdit} isEditable={isEditable} />
            </Feature>
          </LevelItem>
        </Level>
      </CardTitle>
      <CardBody>{children}</CardBody>
    </Card>
  );
}

function EditButton({
  isEditable,
  onClick,
}: {
  isEditable: boolean;
  onClick: () => void;
}) {
  if (isEditable) {
    return <Link onClick={onClick}>Edit</Link>;
  }
  return <div />;
}
