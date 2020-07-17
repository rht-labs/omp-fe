import { EngagementService } from '../engagement_service';
import { Engagement } from '../../../schemas/engagement_schema';
import Axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { EngagementFormConfig } from '../../../schemas/engagement_config';
import { AlreadyExistsError } from '../engagement_service_errors';
import { EngagementJsonSerializer } from '../../../serializers/engagement/engagement_json_serializer';
import { Logger } from '../../../utilities/logger';
import { handleAxiosResponseErrors } from '../../common/axios/http_error_handlers';
import { UserToken } from '../../../schemas/user_token_schema';

export class Apiv1EngagementService extends EngagementService {
  constructor(baseURL: string) {
    super();
    this.axios = Axios.create({ baseURL });
    this.axios.interceptors.request.use((request: AxiosRequestConfig) => {
      request.headers.Authorization = `Bearer ${UserToken.token?.accessToken}`;
      return request;
    });
  }
  private static engagementSerializer = new EngagementJsonSerializer();
  axios?: AxiosInstance;
  async fetchEngagements(): Promise<Engagement[]> {
    try {
      const { data: engagementsData } = await this.axios.get(`/engagements`);
      const serializedEngagements = engagementsData.map(engagementMap =>
        Apiv1EngagementService.engagementSerializer.deserialize(engagementMap)
      );
      return serializedEngagements;
    } catch (e) {
      if (e.isAxiosError) {
        handleAxiosResponseErrors(e);
      } else {
        throw e;
      }
    }
  }
  async createEngagement(engagementData: any): Promise<Engagement> {
    try {
      const { data } = await this.axios.post(`/engagements`, engagementData);
      return Apiv1EngagementService.engagementSerializer.deserialize(data);
    } catch (e) {
      Logger.instance.error(e);
      if (e.response.status === 409) {
        throw new AlreadyExistsError(
          'A project with this customer name and project name already exists'
        );
      }
      if (e.isAxiosError) {
        handleAxiosResponseErrors(e);
      } else {
        throw e;
      }
    }
  }
  async saveEngagement(engagementData: any): Promise<Engagement> {
    try {
      const { data } = await this.axios.put(
        `/engagements/customers/${engagementData.customer_name}/projects/${engagementData.project_name}`,
        Apiv1EngagementService.engagementSerializer.serialize(engagementData)
      );
      return Apiv1EngagementService.engagementSerializer.deserialize(data);
    } catch (e) {
      if (e.isAxiosError) {
        handleAxiosResponseErrors(e);
      } else {
        throw e;
      }
    }
  }
  async launchEngagement(engagementData: any): Promise<Engagement> {
    try {
      const { data } = await this.axios.put(
        `/engagements/launch`,
        engagementData
      );
      return Apiv1EngagementService.engagementSerializer.deserialize(data);
    } catch (e) {
      if (e.isAxiosError) {
        handleAxiosResponseErrors(e);
      } else {
        throw e;
      }
    }
  }
  async getConfig(): Promise<EngagementFormConfig> {
    try {
      const { data } = await this.axios.get(`/config`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept-version': 'v2',
          Accept: 'application/json',
        },
      });
      return data as EngagementFormConfig;
    } catch (e) {
      if (e.isAxiosError) {
        handleAxiosResponseErrors(e);
      } else {
        throw e;
      }
    }
  }
}
