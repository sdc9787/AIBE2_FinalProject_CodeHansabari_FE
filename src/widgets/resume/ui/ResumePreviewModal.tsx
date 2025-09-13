'use client';

import React, { useState } from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  PDFViewer,
  PDFDownloadLink,
  Image,
} from '@react-pdf/renderer';
import { CreateResumeRequest, ResumeMetadata } from '@/entities';
import { motion, AnimatePresence } from 'framer-motion';

// 한글 폰트 등록 (Noto Sans KR - 로컬 파일 사용)
// 주의: public/fonts 폴더에 한글을 지원하는 폰트 파일을 넣어야 합니다.
// 예: public/fonts/NotoSansKR-Regular.otf, public/fonts/NotoSansKR-Bold.otf
Font.register({
  family: 'NotoSansKR',
  fonts: [
    { src: '/font/NotoSansKR-Bold.ttf', fontWeight: 'bold' },
    { src: '/font/NotoSansKR-Light.ttf', fontWeight: 'light' },
    { src: '/font/NotoSansKR-Medium.ttf', fontWeight: 'medium' },
    { src: '/font/NotoSansKR-Regular.ttf', fontWeight: 'normal' },
    { src: '/font/NotoSansKR-SemiBold.ttf', fontWeight: 'semibold' },
    { src: '/font/NotoSansKR-Thin.ttf', fontWeight: 'thin' },
  ],
});

// XEIcon 폰트 등록 (public/xeicon 폴더 안의 폰트 파일 사용)
// public/xeicon/fonts/xeicon.ttf 파일이 존재함
Font.register({
  family: 'xeicon',
  src: '/xeicon/fonts/xeicon.ttf',
});

// 클래식 스타일 정의
const classicStyles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 40,
    fontFamily: 'NotoSansKR',
  },
  section: {
    marginBottom: 15,
  },
  // 이름 타이틀
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'left',
    color: '#374151',
  },
  // 연락처 정보
  contactInfo: {
    fontSize: 11,
    lineHeight: 1.3,
    marginBottom: 2,
    color: '#374151',
  },
  // 섹션 제목 (개발 직무, 기술 스택 등)
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 15,
    color: '#374151',
    backgroundColor: '#f3f4f6',
    padding: 6,
    borderRadius: 3,
  },
  // 일반 텍스트
  text: {
    fontSize: 11,
    lineHeight: 1.4,
    marginBottom: 3,
    color: '#000000',
  },
  // 볼드 텍스트
  boldText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 3,
  },
  // 소개 텍스트 (여러 줄)
  introductionText: {
    fontSize: 11,
    lineHeight: 1.5,
    marginBottom: 4,
    color: '#000000',
  },
  // 기술 스택 컨테이너
  techStackContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
    marginBottom: 10,
  },
  // 개별 기술 스택
  techStack: {
    fontSize: 10,
    backgroundColor: '#f3f4f6',
    color: '#374151',
    paddingTop: 6,
    paddingBottom: 6,
    paddingLeft: 10,
    paddingRight: 10,
    marginRight: 8,
    marginBottom: 4,
    borderColor: '#e4e4e4',
    borderRadius: 100,
    borderWidth: 1,
  },
  // 개발 직무 배지 (기술스택과 유사한 스타일)
  jobBadge: {
    fontSize: 10,
    backgroundColor: '#f3f4f6',
    color: '#374151',
    paddingTop: 6,
    paddingBottom: 6,
    paddingLeft: 10,
    paddingRight: 10,
    borderColor: '#e4e4e4',
    borderRadius: 100,
    borderWidth: 1,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  // 프로젝트/경력 아이템
  itemContainer: {
    marginBottom: 15,
    paddingLeft: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#c4c4c4',
  },
  // 프로젝트명, 회사명 등
  itemTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 4,
  },
  // 기간, 날짜
  dateText: {
    fontSize: 10,
    color: '#6b7280',
    marginBottom: 4,
  },
  // 설명 텍스트
  descriptionText: {
    fontSize: 10,
    lineHeight: 1.4,
    color: '#000000',
    marginBottom: 3,
  },
  // 학력 정보 행
  educationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  // 좌측 정보 (학교명, 전공)
  educationLeft: {
    flex: 1,
  },
  // 우측 정보 (GPA, 졸업일)
  educationRight: {
    alignItems: 'flex-end',
  },
  // 경력 요약
  careerSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  // 프로젝트 메타 정보
  projectMeta: {
    fontSize: 9,
    color: '#6b7280',
    marginBottom: 3,
  },
  // 링크 정보
  linkText: {
    fontSize: 10,
    color: '#1d4ed8',
    marginBottom: 2,
  },
  // 링크 행 (왼쪽 라벨 | 오른쪽 URL)
  linkRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  linkLabel: {
    fontSize: 10,
    color: '#374151',
  },
  linkUrl: {
    fontSize: 10,
    color: '#374151',
    fontWeight: 'bold',
    textDecoration: 'underline',
  },
  linkDivider: {
    borderBottomWidth: 0.5,
    borderColor: '#e5e7eb',
    marginTop: 6,
  },
});

// 모던 스타일 정의 (클래식 기반 + 컬러)
const modernStyles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 40,
    fontFamily: 'NotoSansKR',
  },
  section: {
    marginBottom: 15,
  },
  // 이름 타이틀 - 블루 컬러
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'left',
    color: '#1e40af',
  },
  // 연락처 정보
  contactInfo: {
    fontSize: 11,
    lineHeight: 1.3,
    marginBottom: 2,
    color: '#374151',
  },
  // 섹션 제목 - 블루 컬러 + 배경
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 15,
    color: '#1e40af',
    backgroundColor: '#f0f9ff',
    padding: 6,
    borderRadius: 3,
  },
  // 일반 텍스트
  text: {
    fontSize: 11,
    lineHeight: 1.4,
    marginBottom: 3,
    color: '#374151',
  },
  // 볼드 텍스트
  boldText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 3,
  },
  // 소개 텍스트
  introductionText: {
    fontSize: 11,
    lineHeight: 1.5,
    marginBottom: 4,
    color: '#374151',
  },
  // 기술 스택 컨테이너
  techStackContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
    marginBottom: 10,
  },
  // 개별 기술 스택 - 블루 배경
  techStack: {
    fontSize: 10,
    backgroundColor: '#dbeafe',
    color: '#1d4ed8',
    paddingTop: 6,
    paddingBottom: 6,
    paddingLeft: 10,
    paddingRight: 10,
    marginRight: 8,
    marginBottom: 4,
    borderRadius: 100,
  },
  // 개발 직무 배지 (모던 스타일)
  jobBadge: {
    fontSize: 10,
    backgroundColor: '#dbeafe',
    color: '#1d4ed8',
    paddingTop: 6,
    paddingBottom: 6,
    paddingLeft: 10,
    paddingRight: 10,
    marginRight: 8,
    marginBottom: 4,
    borderRadius: 100,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  // 프로젝트/경력 아이템
  itemContainer: {
    marginBottom: 15,
    paddingLeft: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#3b82f6',
  },
  // 프로젝트명, 회사명 등
  itemTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 4,
  },
  // 기간, 날짜
  dateText: {
    fontSize: 10,
    color: '#6b7280',
    marginBottom: 4,
  },
  // 설명 텍스트
  descriptionText: {
    fontSize: 10,
    lineHeight: 1.4,
    color: '#374151',
    marginBottom: 3,
  },
  // 학력 정보 행
  educationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    backgroundColor: '#f9fafb',
    padding: 8,
    borderRadius: 4,
  },
  // 좌측 정보
  educationLeft: {
    flex: 1,
  },
  // 우측 정보
  educationRight: {
    alignItems: 'flex-end',
  },
  // 경력 요약
  careerSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    backgroundColor: '#f0f9ff',
    padding: 8,
    borderRadius: 4,
  },
  // 프로젝트 메타 정보
  projectMeta: {
    fontSize: 9,
    color: '#6b7280',
    marginBottom: 3,
  },
  // 링크 정보
  linkText: {
    fontSize: 10,
    color: '#1d4ed8',
    marginBottom: 2,
  },
  // 링크 행 (모던 스타일)
  linkRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  linkLabel: {
    fontSize: 10,
    color: '#374151',
  },
  linkUrl: {
    fontSize: 10,
    color: '#1d4ed8',
    fontWeight: 'bold',
    textDecoration: 'underline',
  },
  linkDivider: {
    borderBottomWidth: 0.5,
    borderColor: '#e6f0ff',
    marginTop: 6,
  },
});

interface ResumePreviewModalProps {
  onClose: () => void;
  DataForm: CreateResumeRequest;
  MetaData: ResumeMetadata['data'];
}

// PDF 문서 컴포넌트
const ResumePDFDocument = ({
  resumeData,
  metaData,
}: {
  resumeData: CreateResumeRequest;
  metaData: ResumeMetadata['data'];
}) => {
  if (!resumeData) return null;

  const styles = resumeData.type === 'MODERN' ? modernStyles : classicStyles;

  // metaData에서 techStacks를 가져옵니다.
  const techMeta = metaData?.techStacks || [];

  // metaData에서 degreeLevels를 가져옵니다.
  const degreeLevels = metaData?.degreeLevels || [];

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* 기본 정보 - 헤더 형태 */}
        <View style={styles.section} wrap={false}>
          <Text style={styles.title}>{resumeData.name}</Text>

          {/* 이메일 (xeicon 폰트의 mail 아이콘) */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 1,
            }}
          >
            <Text
              style={{ fontFamily: 'xeicon', fontSize: 12, marginRight: 6 }}
            >
              {'\uEA07'}
            </Text>
            <Text style={styles.contactInfo}>{resumeData.email}</Text>
          </View>

          {/* 전화번호 (xeicon 폰트의 phone 아이콘) */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 1,
            }}
          >
            <Text
              style={{ fontFamily: 'xeicon', fontSize: 12, marginRight: 6 }}
            >
              {'\uE9D3'}
            </Text>
            <Text style={{ ...styles.contactInfo, marginRight: 10 }}>
              {resumeData.phone}
            </Text>
            <Text
              style={{ fontFamily: 'xeicon', fontSize: 12, marginRight: 6 }}
            >
              {'\uE9A0'}
            </Text>
            <Text style={styles.contactInfo}>{resumeData.birthYear}년생</Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 1,
            }}
          ></View>
        </View>

        {/* 간단 소개 */}
        {resumeData.introduction && (
          <View style={styles.section} wrap={false}>
            <Text style={styles.introductionText}>
              {resumeData.introduction}
            </Text>
          </View>
        )}

        {/* 개발 직무 */}
        <View style={styles.section} wrap={false}>
          <Text style={styles.sectionTitle}>개발 직무</Text>
          <Text style={styles.jobBadge}>{resumeData.fieldName}</Text>
        </View>

        {/* 기술 스택 */}
        {resumeData.techStacks && resumeData.techStacks.length > 0 && (
          <View style={styles.section} wrap={false}>
            <Text style={styles.sectionTitle}>기술 스택</Text>
            <View style={styles.techStackContainer}>
              {resumeData.techStacks.map((tech, index: number) => (
                <Text key={index} style={styles.techStack}>
                  {techMeta.find((t) => t.id === tech.techStackId)?.name ||
                    `기술스택 ${index + 1}`}
                </Text>
              ))}
            </View>
          </View>
        )}

        {/* 학력 */}
        {resumeData.educations && resumeData.educations.length > 0 && (
          <View style={styles.section} wrap={false}>
            <Text style={styles.sectionTitle}>학력</Text>
            {resumeData.educations.map((edu, index: number) => {
              const degreeDesc =
                degreeLevels.find((d) => d.value === edu.degreeLevel)
                  ?.description || `학위 ${edu.degreeLevel}`;
              const gpaDisplay =
                edu.personalGpa != null
                  ? `${edu.personalGpa}${edu.totalGpa ? `/${edu.totalGpa}` : ''}`
                  : '';

              return (
                <View key={index} style={styles.itemContainer} wrap={false}>
                  <View key={index} style={{ marginBottom: 10 }}>
                    <Text style={styles.boldText}>
                      {edu.schoolName} {' | '} {degreeDesc}
                    </Text>

                    <Text style={styles.text}>
                      {edu.major || ''}
                      {edu.major && gpaDisplay ? ' | ' : ''}
                      {gpaDisplay}
                    </Text>

                    <Text style={styles.dateText}>{edu.graduationDate}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* 경력 */}
        {resumeData.careers && resumeData.careers.length > 0 && (
          <View style={styles.section} wrap={false}>
            <Text style={styles.sectionTitle}>경력</Text>
            {resumeData.careers.map((career, index: number) => (
              <View key={index} style={styles.itemContainer} wrap={false}>
                <Text style={styles.itemTitle}>{career.companyName}</Text>
                <Text style={styles.text}>{career.departmentPosition}</Text>
                <Text style={styles.dateText}>
                  {career.startDate} ~ {career.endDate}
                </Text>
                <Text style={styles.descriptionText}>{career.mainTasks}</Text>
                {/* 경력의 기술 스택 */}
                {career.techStacks && career.techStacks.length > 0 && (
                  <View style={styles.techStackContainer}>
                    {career.techStacks.map((tech, techIndex: number) => (
                      <Text key={techIndex} style={styles.techStack}>
                        {techMeta.find((t) => t.id === tech.techStackId)
                          ?.name || `기술 ${techIndex + 1}`}
                      </Text>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {/* 프로젝트 */}
        {resumeData.projects && resumeData.projects.length > 0 && (
          <View style={styles.section} wrap={false}>
            <Text style={styles.sectionTitle}>프로젝트</Text>
            {resumeData.projects.map((project, index: number) => (
              <View key={index} style={styles.itemContainer} wrap={false}>
                <Text style={styles.itemTitle}>{project.name}</Text>
                <Text style={styles.descriptionText}>
                  {project.description}
                </Text>
                <Text style={styles.dateText}>
                  {project.startDate} ~ {project.endDate}
                </Text>

                {/* 기술 스택 */}
                {project.techStacks && project.techStacks.length > 0 && (
                  <View style={styles.techStackContainer}>
                    {project.techStacks.map((tech, techIndex: number) => (
                      <Text key={techIndex} style={styles.techStack}>
                        {techMeta.find((t) => t.id === tech.techStackId)
                          ?.name || `기술 ${techIndex + 1}`}
                      </Text>
                    ))}
                  </View>
                )}

                {/* 링크 정보 */}
                {project.deployUrl && (
                  <Text style={styles.linkText}>
                    배포 URL: {project.deployUrl}
                  </Text>
                )}
                {project.repositoryUrl && (
                  <Text style={styles.linkText}>
                    저장소: {project.repositoryUrl}
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* 교육 이력 */}
        {resumeData.trainings && resumeData.trainings.length > 0 && (
          <View style={styles.section} wrap={false}>
            <Text style={styles.sectionTitle}>교육 이력</Text>
            {resumeData.trainings.map((training, index: number) => (
              <View key={index} style={styles.itemContainer} wrap={false}>
                <Text style={styles.itemTitle}>{training.courseName}</Text>
                <Text style={styles.text}>{training.institutionName}</Text>
                <Text style={styles.dateText}>
                  {training.startDate} ~ {training.endDate}
                </Text>
                <Text style={styles.descriptionText}>
                  {training.detailedContent}
                </Text>
                {/* 교육의 기술 스택 */}
                {training.techStacks && training.techStacks.length > 0 && (
                  <View style={styles.techStackContainer}>
                    {training.techStacks.map((tech, techIndex: number) => (
                      <Text key={techIndex} style={styles.techStack}>
                        {techMeta.find((t) => t.id === tech.techStackId)
                          ?.name || `기술 ${techIndex + 1}`}
                      </Text>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {/* 기타 사항 */}
        {resumeData.additionalInfos &&
          resumeData.additionalInfos.length > 0 && (
            <View style={styles.section} wrap={false}>
              <Text style={styles.sectionTitle}>기타 사항</Text>
              {resumeData.additionalInfos.map((info, index: number) => (
                <View key={index} style={styles.itemContainer} wrap={false}>
                  <Text style={styles.itemTitle}>{info.activityName}</Text>
                  <Text style={styles.text}>{info.relatedOrganization}</Text>
                  <Text style={styles.dateText}>
                    {info.startDate} ~ {info.endDate}
                  </Text>
                  <Text style={styles.descriptionText}>
                    {info.detailedContent}
                  </Text>
                </View>
              ))}
            </View>
          )}

        {/* 링크 */}
        <View style={styles.section} wrap={false}>
          <Text style={styles.sectionTitle}>링크</Text>

          {resumeData.githubUrl && (
            <View>
              <View style={styles.linkRow}>
                <Text style={styles.linkLabel}>Github</Text>
                <Text style={styles.linkUrl}>{resumeData.githubUrl}</Text>
              </View>
              <View style={styles.linkDivider} />
            </View>
          )}

          {resumeData.blogUrl && (
            <View>
              <View style={styles.linkRow}>
                <Text style={styles.linkLabel}>Portfolio</Text>
                <Text style={styles.linkUrl}>{resumeData.blogUrl}</Text>
              </View>
              <View style={styles.linkDivider} />
            </View>
          )}

          {resumeData.notionUrl && (
            <View>
              <View style={styles.linkRow}>
                <Text style={styles.linkLabel}>Portfolio</Text>
                <Text style={styles.linkUrl}>{resumeData.notionUrl}</Text>
              </View>
              <View style={styles.linkDivider} />
            </View>
          )}

          {resumeData.customLinks &&
            resumeData.customLinks.map((link, index: number) => (
              <View key={index}>
                <View style={styles.linkRow}>
                  <Text style={styles.linkLabel}>{link.name}</Text>
                  <Text style={styles.linkUrl}>{link.url}</Text>
                </View>
                <View style={styles.linkDivider} />
              </View>
            ))}
        </View>
      </Page>
    </Document>
  );
};

export function ResumePreviewModal({
  onClose,
  DataForm,
  MetaData,
}: ResumePreviewModalProps) {
  // 파일명: 제목(title) 또는 이름(name)을 사용
  const fileName = `${(DataForm?.title || DataForm?.name || 'resume')
    .toString()
    .replace(/\s+/g, '_')}.pdf`;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* 헤더 */}
          <div className="flex items-center justify-between border-b border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-800">
              이력서 미리보기 및 다운로드
            </h2>
            <div className="flex items-center gap-3">
              <PDFDownloadLink
                document={
                  <ResumePDFDocument
                    resumeData={DataForm}
                    metaData={MetaData}
                  />
                }
                fileName={fileName}
                style={{ textDecoration: 'none' }}
              >
                {({ loading }) => (
                  <button
                    className="rounded-md bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700"
                    type="button"
                  >
                    {loading ? '다운로드 준비중...' : 'PDF 저장'}
                  </button>
                )}
              </PDFDownloadLink>

              <button
                onClick={onClose}
                className="rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
              >
                <i className="xi-close xi-x"></i>
              </button>
            </div>
          </div>

          {/* 컨텐츠 */}
          <div className="p-6">
            {DataForm && (
              <div className="max-h-[80vh] overflow-hidden rounded-lg border border-gray-200">
                {/* PDFViewer로 실제 PDF와 동일한 렌더링을 표시합니다. */}
                <PDFViewer style={{ width: '100%', height: '80vh' }}>
                  <ResumePDFDocument
                    resumeData={DataForm}
                    metaData={MetaData}
                  />
                </PDFViewer>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
