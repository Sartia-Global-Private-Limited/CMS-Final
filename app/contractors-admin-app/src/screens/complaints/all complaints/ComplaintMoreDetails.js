import {StyleSheet, View, SafeAreaView, ScrollView} from 'react-native';
import React from 'react';
import CustomeHeader from '../../../component/CustomeHeader';
import Colors from '../../../constants/Colors';
import ScreensLabel from '../../../constants/ScreensLabel';
import CustomeCard from '../../../component/CustomeCard';

const ComplaintMoreDetails = ({navigation, route}) => {
  const data = route?.params?.moreComplaintData;
  const memberCount = route?.params?.memberCountData;
  const label = ScreensLabel();
  /*function for finding object is empty or not retun boolean value*/
  function isObjectEmpty(obj) {
    return Object.keys(obj).length === 0;
  }

  /* for getting color of status*/
  function getStatusColor(action) {
    switch (action) {
      case 'pending':
        return Colors().pending;
      case 'rejected':
        return Colors().rejected;
      case 'working':
        return Colors().working;
      case 'approved':
        return Colors().aprroved;
      case 'resolved':
        return Colors().resolved;
      case 'Hold':
        return Colors().partial;
      default:
        return 'black';
    }
  }

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors().screenBackground}}>
      <CustomeHeader headerTitle={label.COMPLAINT_MORE_DETAIL} />

      <ScrollView>
        <View style={{}}>
          {/* card for company detail */}
          <CustomeCard
            headerName={'COMlaint DETAILS'}
            data={[
              {
                key: 'complaint id',
                value: data?.complaintDetails?.complaint_unique_id,
                keyColor: Colors().skyBule,
              },
              {
                key: 'TYPE',
                value: data?.complaintDetails?.complaint_type,
              },
              {
                key: 'DESCRIPTION',
                value: data?.complaintDetails?.complaint_type,
              },
              {
                key: 'Generated at',
                value: data?.complaintDetails?.complaint_generated_at,
              },
            ]}
            status={[
              {
                key: 'status',
                value: data?.complaintDetails?.complaint_Status,
                color: getStatusColor(data?.complaintDetails?.complaint_Status),
              },
            ]}
            rightStatus={[
              {
                key: 'Member count',
                value: memberCount,
                color: memberCount > 0 ? Colors().aprroved : Colors().red,
              },
            ]}
          />

          {/* card for compalint raiser detail */}
          {!isObjectEmpty(data?.complaintRaiserDetails) && (
            <CustomeCard
              headerName={' COMPLAINT RAISER DETAILS'}
              avatarImage={data?.complaintRaiserDetails?.image}
              data={[{key: 'NAME', value: data?.complaintRaiserDetails?.name}]}
            />
          )}

          {/* card for compalint appproval detail */}
          {!isObjectEmpty(data?.complaintApprovalData) && (
            <>
              <CustomeCard
                headerName={
                  data?.complaintDetails?.complaint_Status === 'rejected'
                    ? 'COMPLAINT REJECTED DETAILS'
                    : 'COMPLAINT APPROVAL DETAILS'
                }
                avatarImage={data?.complaintApprovalData?.image}
                data={[
                  {key: 'Name', value: data?.complaintApprovalData?.name},
                  {
                    key: 'title',
                    value: data?.complaintApprovalData?.approve_title,
                  },
                  {
                    key: 'remarks ',
                    value: data?.complaintApprovalData?.approve_remarks,
                  },
                  {
                    key: 'approved at',
                    value: data?.complaintApprovalData?.approved_at,
                  },
                ]}
              />
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ComplaintMoreDetails;

const styles = StyleSheet.create({});
