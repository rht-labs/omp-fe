import { useCallback, useState } from 'react';
import { Engagement, EngagementStatus } from '../../schemas/engagement';
import {
  AlertType,
  IFeedbackContext,
} from '../feedback_context/feedback_context';
import { EngagementService } from '../../services/engagement_service/engagement_service';

export interface EngagementCollectionHookParameters {
  feedbackContext?: IFeedbackContext;
  filter?: EngagementCollectionFilter;
  engagementService: EngagementService;
}
export interface EngagementCollectionFilter {
  engagementStatus?: EngagementStatus;
  startDate?: Date;
  endDate?: Date;
  include?: Array<keyof Engagement>;
  exclude?: Array<keyof Engagement>;
}
export const useEngagementCollection = ({
  feedbackContext,
  filter,
  engagementService,
}: EngagementCollectionHookParameters) => {
  const [engagements, setEngagements] = useState<Partial<Engagement>[]>([]);
  const getEngagements = useCallback(async () => {
    feedbackContext?.showLoader();
    try {
      const engagements = await engagementService.fetchEngagements({
        endDate: filter?.endDate,
        startDate: filter?.startDate,
        engagementStatus: filter?.engagementStatus,
      });
      setEngagements(engagements);
    } catch (e) {
      feedbackContext?.showAlert(
        'Something went wrong while fetching the engagements',
        AlertType.error,
        true
      );
    } finally {
      feedbackContext?.hideLoader();
    }
  }, [
    engagementService,
    filter?.startDate,
    filter?.endDate,
    filter?.engagementStatus,
    // filter?.include,
    // filter?.exclude,
    feedbackContext,
  ]);
  return { getEngagements, engagements };
};