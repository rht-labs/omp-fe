import React, { useState, useEffect } from 'react';
import { DataCard } from '../data_card';
import { Artifact, ArtifactType } from '../../../schemas/engagement';
import { EngagementFormConfig } from '../../../schemas/engagement_config';
import { EditButton } from '../../data_card_edit_button/data_card_edit_button';
import { useModalVisibility } from '../../../context/edit_modal_visibility_context/edit_modal_visibility_hook';
import {
  Table,
  TableVariant,
  TableHeader,
  TableBody,
} from '@patternfly/react-table';
import {
  Dropdown,
  KebabToggle,
  DropdownItem,
  Modal,
  ModalVariant,
  Button,
  Form,
  FormSelect,
  FormGroup,
  FormSelectOption,
  TextInput,
} from '@patternfly/react-core';
import { EditModalTemplate } from '../../../layout/edit_modal_template';

export interface EngagementTimelineCardProps {
  artifacts: Artifact[];
  onChangeArtifacts: (value: Artifact[]) => void;
  engagementFormConfig: EngagementFormConfig;
  onSave: () => void;
}

const ARTIFACT_CRUD_MODAL = 'artifact_crud_modal';

export interface ArtifactEditModalProps extends EngagementTimelineCardProps {
  onClose: () => void;
  isOpen: boolean;
  artifact: Artifact;
}

function ArtifactEditModal(props: ArtifactEditModalProps) {
  const { artifact: artifactEdits = {} } = props;
  const setArtifactEdits = () => {};
  return (
    <Modal
      variant={ModalVariant.small}
      isOpen={props.isOpen}
      onClose={props.onClose}
      title="Engagement Artifact"
    >
      <EditModalTemplate
        actions={
          <Button
            data-testid="save-artifact"
            onClick={props.onSave}
            data-cy={'save-artifact-button'}
          >
            Save
          </Button>
        }
      >
        <Form>
          <FormGroup label="Artifact Type" isRequired fieldId="artifact-type">
            <FormSelect
              data-testid="artifact-type-select"
              aria-label="Artifact Type"
              id="artifact-type-select"
              value={artifactEdits?.type}
              onChange={(value: ArtifactType) =>
                setArtifactEdits({ ...artifactEdits, type: value })
              }
            >
              {Object.keys(ArtifactType).map(artifactTypeKey => (
                <FormSelectOption
                  value={artifactTypeKey}
                  label={ArtifactType[artifactTypeKey]}
                >
                  {ArtifactType[artifactTypeKey]}
                </FormSelectOption>
              ))}
            </FormSelect>
          </FormGroup>
          <FormGroup label="Artifact Title" isRequired fieldId="artifact-title">
            <TextInput
              isRequired
              data-testid="artifact-title-input"
              name="artifact_title"
              data-cy="artifact-title-input"
              value={artifactEdits?.title}
              onChange={e => setArtifactEdits({ ...artifactEdits, title: e })}
            />
          </FormGroup>
          <FormGroup label="Artifact Link" isRequired fieldId="artifact-link">
            <TextInput
              isRequired
              data-testid="artifact-link-input"
              name="artifact_link"
              data-cy="artifact-link-input"
              value={artifactEdits?.linkAddress}
              onChange={e =>
                setArtifactEdits({ ...artifactEdits, linkAddress: e })
              }
            />
          </FormGroup>
        </Form>
      </EditModalTemplate>
    </Modal>
  );
}

export function EngagementTimelineCard(props: EngagementTimelineCardProps) {
  const { requestOpen, activeModalKey, requestClose } = useModalVisibility();
  const [currentArtifact, setCurrentArtifact] = useState<Artifact>();

  const onEditArtifact = (artifact: Artifact) => {
    console.log(artifact);
    setCurrentArtifact(artifact);
    requestOpen(ARTIFACT_CRUD_MODAL);
  };
  return (
    <>
      <ArtifactEditModal
        artifact={currentArtifact}
        isOpen={activeModalKey === ARTIFACT_CRUD_MODAL}
        onClose={requestClose}
        {...props}
      ></ArtifactEditModal>
      <DataCard
        title="Engagement Timeline"
        trailingIcon={() => <div />}
        actionButton={() => (
          <EditButton
            text="Add an Artifact"
            onClick={() => requestOpen(ARTIFACT_CRUD_MODAL)}
          />
        )}
      >
        <EngagementTimelineCardBody editArtifact={onEditArtifact} {...props} />
      </DataCard>
    </>
  );
}

function EngagementTimelineCardBody(
  props: EngagementTimelineCardProps & {
    editArtifact(artifact: Artifact): void;
  }
) {
  const [currentOpenDropdown, setCurrentOpenDropdown] = useState<number>();
  const columns = [
    { title: 'Type' },
    { title: 'Title' },
    { title: 'Link to Resource' },
    { title: 'Actions' },
  ];
  const actionItems = [<DropdownItem key="edit">Edit</DropdownItem>];
  const rows = props.artifacts.map((artifact, idx) => [
    artifact.type,
    artifact.title,
    { title: <a href={artifact.linkAddress}>{artifact.linkAddress}</a> },
    {
      title: (
        <Dropdown
          isPlain
          dropdownItems={actionItems}
          isOpen={idx === currentOpenDropdown}
          onSelect={() => {
            setCurrentOpenDropdown(undefined);
            props.editArtifact(artifact);
          }}
          toggle={
            <KebabToggle
              onToggle={() =>
                currentOpenDropdown === idx
                  ? setCurrentOpenDropdown(undefined)
                  : setCurrentOpenDropdown(idx)
              }
              id={`toggle-id-${idx}`}
            />
          }
        />
      ),
    },
  ]);
  return (
    <Table
      aria-label="Engagement Timeline"
      variant={TableVariant.compact}
      cells={columns}
      rows={rows}
    >
      <TableHeader />
      <TableBody />
    </Table>
  );
}
