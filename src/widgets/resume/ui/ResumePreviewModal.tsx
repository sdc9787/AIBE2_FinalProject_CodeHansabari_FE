'use client';

import React, { useState } from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFDownloadLink,
  Font,
  PDFViewer,
} from '@react-pdf/renderer';
import { CreateResumeRequest } from '@/entities';
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

// 클래식 스타일 정의
const classicStyles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 40,
    fontFamily: 'NotoSansKR',
  },
  section: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 25,
    textAlign: 'center',
    color: '#1a202c',
    borderBottomWidth: 2,
    borderBottomColor: '#2d3748',
    paddingBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#2d3748',
    borderBottomWidth: 1,
    borderBottomColor: '#4a5568',
    paddingBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  text: {
    fontSize: 12,
    lineHeight: 1.6,
    marginBottom: 6,
    color: '#2d3748',
  },
  boldText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1a202c',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  leftColumn: {
    width: '25%',
  },
  rightColumn: {
    width: '75%',
  },
  itemContainer: {
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#a0aec0',
  },
  techStack: {
    fontSize: 10,
    backgroundColor: '#edf2f7',
    color: '#2d3748',
    padding: 4,
    margin: 2,
    borderRadius: 2,
  },
  techStackContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
});

// 모던 스타일 정의
const modernStyles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
    fontFamily: 'NotoSansKR',
  },
  section: {
    marginBottom: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'left',
    color: '#1e40af',
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
    paddingLeft: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1e40af',
    backgroundColor: '#eff6ff',
    padding: 8,
    borderRadius: 4,
  },
  text: {
    fontSize: 11,
    lineHeight: 1.5,
    marginBottom: 5,
    color: '#4b5563',
  },
  boldText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  leftColumn: {
    width: '30%',
  },
  rightColumn: {
    width: '70%',
  },
  itemContainer: {
    marginBottom: 12,
    paddingBottom: 8,
    paddingLeft: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#e5e7eb',
  },
  techStack: {
    fontSize: 10,
    backgroundColor: '#dbeafe',
    color: '#1d4ed8',
    padding: 3,
    margin: 2,
    borderRadius: 12,
  },
  techStackContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
  },
});

interface ResumePreviewModalProps {
  onClose: () => void;
  DataForm: CreateResumeRequest;
}

// PDF 문서 컴포넌트
const ResumePDFDocument = ({ resumeData }: { resumeData: any }) => {
  if (!resumeData) return null;

  // 타입에 따라 스타일 선택
  const styles = resumeData.type === 'MODERN' ? modernStyles : classicStyles;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* 제목 */}
        <Text style={styles.title}>{resumeData.title || '이력서'}</Text>

        {/* 기본 정보 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>기본 정보</Text>
          <View style={styles.row}>
            <View style={styles.leftColumn}>
              <Text style={styles.boldText}>이름:</Text>
            </View>
            <View style={styles.rightColumn}>
              <Text style={styles.text}>{resumeData.name}</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.leftColumn}>
              <Text style={styles.boldText}>생년:</Text>
            </View>
            <View style={styles.rightColumn}>
              <Text style={styles.text}>{resumeData.birthYear}년</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.leftColumn}>
              <Text style={styles.boldText}>이메일:</Text>
            </View>
            <View style={styles.rightColumn}>
              <Text style={styles.text}>{resumeData.email}</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.leftColumn}>
              <Text style={styles.boldText}>전화번호:</Text>
            </View>
            <View style={styles.rightColumn}>
              <Text style={styles.text}>{resumeData.phone}</Text>
            </View>
          </View>
        </View>

        {/* 간단 소개 */}
        {resumeData.introduction && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>간단 소개</Text>
            <Text style={styles.text}>{resumeData.introduction}</Text>
          </View>
        )}

        {/* 기술 스택 */}
        {resumeData.techStacks && resumeData.techStacks.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>기술 스택</Text>
            <View style={styles.techStackContainer}>
              {resumeData.techStacks.map((tech: any, index: number) => (
                <Text key={index} style={styles.techStack}>
                  {tech.name || `기술스택 ${index + 1}`}
                </Text>
              ))}
            </View>
          </View>
        )}

        {/* 학력 */}
        {resumeData.educations && resumeData.educations.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>학력</Text>
            {resumeData.educations.map((edu: any, index: number) => (
              <View key={index} style={styles.itemContainer}>
                <Text style={styles.boldText}>{edu.schoolName}</Text>
                <Text style={styles.text}>
                  {edu.major} / {edu.degreeLevel}
                </Text>
                <Text style={styles.text}>졸업일: {edu.graduationDate}</Text>
              </View>
            ))}
          </View>
        )}

        {/* 경력 */}
        {resumeData.careers && resumeData.careers.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>경력</Text>
            {resumeData.careers.map((career: any, index: number) => (
              <View key={index} style={styles.itemContainer}>
                <Text style={styles.boldText}>{career.companyName}</Text>
                <Text style={styles.text}>{career.departmentPosition}</Text>
                <Text style={styles.text}>
                  {career.startDate} ~ {career.endDate}
                </Text>
                <Text style={styles.text}>{career.mainTasks}</Text>
                {career.techStacks && career.techStacks.length > 0 && (
                  <View style={styles.techStackContainer}>
                    {career.techStacks.map((tech: any, techIndex: number) => (
                      <Text key={techIndex} style={styles.techStack}>
                        {tech.name || `기술 ${techIndex + 1}`}
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
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>프로젝트</Text>
            {resumeData.projects.map((project: any, index: number) => (
              <View key={index} style={styles.itemContainer}>
                <Text style={styles.boldText}>{project.name}</Text>
                <Text style={styles.text}>
                  {project.startDate} ~ {project.endDate}
                </Text>
                <Text style={styles.text}>{project.description}</Text>
                {project.deployUrl && (
                  <Text style={styles.text}>배포 URL: {project.deployUrl}</Text>
                )}
                {project.repositoryUrl && (
                  <Text style={styles.text}>
                    저장소: {project.repositoryUrl}
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* 교육 이력 */}
        {resumeData.trainings && resumeData.trainings.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>교육 이력</Text>
            {resumeData.trainings.map((training: any, index: number) => (
              <View key={index} style={styles.itemContainer}>
                <Text style={styles.boldText}>{training.courseName}</Text>
                <Text style={styles.text}>{training.institutionName}</Text>
                <Text style={styles.text}>
                  {training.startDate} ~ {training.endDate}
                </Text>
                <Text style={styles.text}>{training.detailedContent}</Text>
              </View>
            ))}
          </View>
        )}

        {/* 기타 사항 */}
        {resumeData.additionalInfos &&
          resumeData.additionalInfos.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>기타 사항</Text>
              {resumeData.additionalInfos.map((info: any, index: number) => (
                <View key={index} style={styles.itemContainer}>
                  <Text style={styles.boldText}>{info.activityName}</Text>
                  <Text style={styles.text}>{info.relatedOrganization}</Text>
                  <Text style={styles.text}>
                    {info.startDate} ~ {info.endDate}
                  </Text>
                  <Text style={styles.text}>{info.detailedContent}</Text>
                </View>
              ))}
            </View>
          )}

        {/* 링크 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>링크</Text>
          {resumeData.githubUrl && (
            <Text style={styles.text}>GitHub: {resumeData.githubUrl}</Text>
          )}
          {resumeData.blogUrl && (
            <Text style={styles.text}>Blog: {resumeData.blogUrl}</Text>
          )}
          {resumeData.notionUrl && (
            <Text style={styles.text}>Notion: {resumeData.notionUrl}</Text>
          )}
          {resumeData.customLinks &&
            resumeData.customLinks.map((link: any, index: number) => (
              <Text key={index} style={styles.text}>
                {link.name}: {link.url}
              </Text>
            ))}
        </View>
      </Page>
    </Document>
  );
};

export function ResumePreviewModal({
  onClose,
  DataForm,
}: ResumePreviewModalProps) {
  const [isGenerating, setIsGenerating] = useState(false);

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
            <button
              onClick={onClose}
              className="rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
            >
              <i className="xi-close xi-x"></i>
            </button>
          </div>

          {/* 컨텐츠 */}
          <div className="p-6">
            {DataForm && (
              <div className="max-h-[80vh] overflow-hidden rounded-lg border border-gray-200">
                {/* PDFViewer로 실제 PDF와 동일한 렌더링을 표시합니다. */}
                <PDFViewer style={{ width: '100%', height: '80vh' }}>
                  <ResumePDFDocument resumeData={DataForm} />
                </PDFViewer>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
