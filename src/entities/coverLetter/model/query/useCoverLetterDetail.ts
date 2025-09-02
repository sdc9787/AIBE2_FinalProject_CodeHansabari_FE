import { useQuery } from '@tanstack/react-query';
import { coverLetterQueryKeys } from './queryKey';
import {
  CoverLetterDetailData,
  CoverLetterDetailResponse,
  fetchCoverLetterDetail,
} from '@/entities';

export const useCoverLetterDetail = (coverLetterId: number) => {
  return useQuery<CoverLetterDetailResponse, Error, CoverLetterDetailData>({
    queryKey: coverLetterQueryKeys.detail(coverLetterId),
    queryFn: () => fetchCoverLetterDetail(coverLetterId),
    enabled: !!coverLetterId,
    staleTime: 1000 * 60, // 1분
    refetchOnWindowFocus: false, // 윈도우 포커스 시 refetch 하지 않음
    select: (data) => data.data,
  });
};
