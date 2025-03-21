import { StyleSheet, Text, View, Image } from 'react-native';
import React, { useState } from 'react';
import { apiBaseUrl } from '../../config';
import Images from '../constants/Images';
import SeparatorComponent from './SeparatorComponent';
import NeumorphCard from './NeumorphCard';
import Colors from '../constants/Colors';
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '../utils/ScreenLayout';
import NeuomorphAvatar from './NeuomorphAvatar';
import { Avatar, Icon } from '@rneui/themed';
import ImageViewer from './ImageViewer';
import IconType from '../constants/IconType';
import usePermission from '../hooks/usePermission';

const CustomeCard = ({
  headerName,
  avatarImage,
  data,
  allData,
  approveButton,
  allocateButton,
  editAllocateButton,
  holdButton,
  clockOutButton,
  clockInButton,
  editButton,
  deleteButton,
  reactiveButton,
  changeStatusButton,
  changeButton,
  rejectButton,
  discardButton,
  timelineButton,
  minusButton,
  plusButton,
  downButton,
  listButton,
  feedbackButton,
  attachmentButton,
  autoDeletButton,
  doubleCheckButton,
  toolButton,
  calenderButton,
  imageButton,
  savePdfButton,
  rightStatus,
  status,
  action,
}) => {
  const { permissions } = usePermission({});
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [imageUri, setImageUri] = useState(false);

  return (
    <View style={styles.mainView}>
      {/* Request field */}
      <NeumorphCard>
        <View style={styles.cardContainer}>
          {headerName && (
            <>
              <Text style={[styles.headingTxt, { color: Colors().purple }]}>
                {headerName}
              </Text>
              <SeparatorComponent
                separatorColor={Colors().gray2}
                separatorHeight={0.5}
              />
            </>
          )}

          {/* view for request user */}
          <View
            style={{
              flexDirection: 'row',
              columnGap: 10,
            }}>
            {avatarImage !== undefined && (
              <View>
                <NeuomorphAvatar gap={4}>
                  <Avatar
                    size={50}
                    rounded
                    onPress={() => {
                      setImageModalVisible(true);
                      setImageUri(
                        avatarImage.startsWith('/')
                          ? `${apiBaseUrl}${avatarImage}`
                          : `${avatarImage}`,
                      );
                      action &&
                        action({
                          typeOfButton: 'avatarImage',
                          itemData: allData,
                        });
                    }}
                    source={{
                      uri: avatarImage?.startsWith('/')
                        ? `${apiBaseUrl}${avatarImage}`
                        : avatarImage?.startsWith('data:image') ||
                            avatarImage?.startsWith('file:///')
                          ? `${avatarImage}`
                          : `${
                              Image.resolveAssetSource(Images.DEFAULT_PROFILE)
                                .uri
                            }`,
                    }}
                  />
                </NeuomorphAvatar>
              </View>
            )}

            <View style={{ flex: 1, alignContent: 'center' }}>
              {data.map((itm, index) => (
                <View
                  key={index}
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      width: itm?.key && 140,
                      maxWidth: itm?.key && 150,
                      minWidth: itm?.key && 120,
                    }}>
                    {itm?.key && (
                      <Text
                        numberOfLines={2}
                        style={[
                          styles.cardHeadingTxt,
                          { color: Colors().purple, maxWidth: '100%' },
                        ]}>
                        {itm.key}
                      </Text>
                    )}
                  </View>
                  {itm?.key && (
                    <Text
                      style={[
                        styles.cardHeadingTxt,
                        { color: Colors().purple },
                      ]}>
                      :{'  '}
                    </Text>
                  )}
                  {itm?.component ? (
                    itm?.component
                  ) : (
                    <Text
                      numberOfLines={2}
                      ellipsizeMode="tail"
                      style={[
                        styles.cardtext,
                        {
                          color: itm?.keyColor || Colors().pureBlack,
                        },
                      ]}>
                      {itm.value ? itm?.value : '--'}
                    </Text>
                  )}
                </View>
              ))}
            </View>
          </View>
          {status && (
            <View style={styles.actionView}>
              {status[0]?.key && (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      width: status[0]?.value ? 70 : 140,
                      maxWidth: status[0]?.value ? 70 : 150,
                      minWidth: status[0]?.value ? 70 : 120,
                    }}>
                    <Text
                      style={[
                        styles.cardHeadingTxt,
                        { color: Colors().purple },
                      ]}>
                      {status[0]?.key}
                    </Text>
                  </View>
                  <Text
                    style={[styles.cardHeadingTxt, { color: Colors().purple }]}>
                    :{' '}
                  </Text>
                  {status[0]?.value && (
                    <NeumorphCard>
                      <View style={{ padding: 5 }}>
                        <Text
                          numberOfLines={1}
                          ellipsizeMode="tail"
                          style={[
                            styles.cardtext,
                            { color: status[0]?.color || Colors().pureBlack },
                          ]}>
                          {status[0]?.value}
                        </Text>
                      </View>
                    </NeumorphCard>
                  )}
                  {status[0]?.component && status[0]?.component}
                </View>
              )}

              <View style={styles.actionView2}>
                {rightStatus && (
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {rightStatus[0]?.key && (
                      <Text
                        style={[
                          styles.cardHeadingTxt,
                          { color: Colors().pureBlack },
                        ]}>
                        {rightStatus[0]?.key} :{' '}
                      </Text>
                    )}

                    <View>
                      <NeumorphCard>
                        <View style={{ padding: 5 }}>
                          <Text
                            numberOfLines={1}
                            ellipsizeMode="tail"
                            style={[
                              styles.cardtext,
                              { color: rightStatus[0]?.color },
                            ]}>
                            {rightStatus[0]?.value}
                          </Text>
                        </View>
                      </NeumorphCard>
                    </View>
                  </View>
                )}
                {editButton && permissions?.update === 1 && (
                  <View>
                    <NeumorphCard
                      inner={true}
                      darkShadowColor={Colors().darkShadow}
                      lightShadowColor={Colors().lightShadow}>
                      <Icon
                        size={18}
                        name={'edit'}
                        type={IconType.Feather}
                        color={Colors().aprroved}
                        style={styles.actionIcon}
                        onPress={action.bind(this, {
                          typeOfButton: 'edit',
                          itemData: allData,
                        })}
                      />
                    </NeumorphCard>
                  </View>
                )}
                {rejectButton && (
                  <View>
                    <NeumorphCard
                      inner={true}
                      darkShadowColor={Colors().darkShadow}
                      lightShadowColor={Colors().lightShadow}>
                      <Icon
                        size={18}
                        name="cancel-presentation"
                        type={IconType.MaterialIcons}
                        color={Colors().red}
                        style={styles.actionIcon}
                        onPress={action.bind(this, {
                          typeOfButton: 'reject',
                          itemData: allData,
                        })}
                      />
                    </NeumorphCard>
                  </View>
                )}

                {approveButton && (
                  <View>
                    <NeumorphCard
                      inner={true}
                      darkShadowColor={Colors().darkShadow}
                      lightShadowColor={Colors().lightShadow}>
                      <Icon
                        size={18}
                        name="checksquareo"
                        type={IconType.AntDesign}
                        color={Colors().aprroved}
                        style={styles.actionIcon}
                        // disabled={!item?.active}
                        onPress={action.bind(this, {
                          typeOfButton: 'approve',
                          itemData: allData,
                        })}
                      />
                    </NeumorphCard>
                  </View>
                )}
                {allocateButton && (
                  <View>
                    <NeumorphCard
                      inner={true}
                      darkShadowColor={Colors().darkShadow}
                      lightShadowColor={Colors().lightShadow}>
                      <Icon
                        size={18}
                        name="user-check"
                        type={IconType.Feather}
                        color={Colors().red}
                        style={styles.actionIcon}
                        // disabled={!item?.active}
                        onPress={action.bind(this, {
                          typeOfButton: 'allocate',
                          itemData: allData,
                        })}
                      />
                    </NeumorphCard>
                  </View>
                )}
                {editAllocateButton && (
                  <View>
                    <NeumorphCard
                      inner={true}
                      darkShadowColor={Colors().darkShadow}
                      lightShadowColor={Colors().lightShadow}>
                      <Icon
                        size={18}
                        name="account-edit-outline"
                        type={IconType.MaterialCommunityIcons}
                        color={Colors().aprroved}
                        style={styles.actionIcon}
                        // disabled={!item?.active}
                        onPress={action.bind(this, {
                          typeOfButton: 'editallocate',
                          itemData: allData,
                        })}
                      />
                    </NeumorphCard>
                  </View>
                )}
                {holdButton && (
                  <View>
                    <NeumorphCard
                      inner={true}
                      darkShadowColor={Colors().darkShadow}
                      lightShadowColor={Colors().lightShadow}>
                      <Icon
                        size={18}
                        name="stop-circle"
                        type={IconType.Feather}
                        color={Colors().red}
                        style={styles.actionIcon}
                        // disabled={!item?.active}
                        onPress={action.bind(this, {
                          typeOfButton: 'hold',
                          itemData: allData,
                        })}
                      />
                    </NeumorphCard>
                  </View>
                )}
                {clockOutButton && (
                  <View>
                    <NeumorphCard
                      inner={true}
                      darkShadowColor={Colors().darkShadow}
                      lightShadowColor={Colors().lightShadow}>
                      <Icon
                        size={18}
                        name="login"
                        type={IconType.SimpleLineIcons}
                        color={Colors().red}
                        style={styles.actionIcon}
                        // disabled={!item?.active}
                        onPress={action.bind(this, {
                          typeOfButton: 'clockout',
                          itemData: allData,
                        })}
                      />
                    </NeumorphCard>
                  </View>
                )}
                {clockInButton && (
                  <View>
                    <NeumorphCard
                      inner={true}
                      darkShadowColor={Colors().darkShadow}
                      lightShadowColor={Colors().lightShadow}>
                      <Icon
                        size={18}
                        name="logout"
                        type={IconType.SimpleLineIcons}
                        color={Colors().aprroved}
                        style={styles.actionIcon}
                        // disabled={!item?.active}
                        onPress={action.bind(this, {
                          typeOfButton: 'clockin',
                          itemData: allData,
                        })}
                      />
                    </NeumorphCard>
                  </View>
                )}
                {deleteButton && permissions?.delete === 1 && (
                  <View>
                    <NeumorphCard
                      inner={true}
                      darkShadowColor={Colors().darkShadow}
                      lightShadowColor={Colors().lightShadow}>
                      <Icon
                        size={18}
                        name="delete"
                        type={IconType.AntDesign}
                        color={Colors().red}
                        style={styles.actionIcon}
                        // disabled={!item?.active}
                        onPress={action.bind(this, {
                          typeOfButton: 'delete',
                          itemData: allData,
                        })}
                      />
                    </NeumorphCard>
                  </View>
                )}

                {minusButton && (
                  <View>
                    <NeumorphCard
                      inner={true}
                      darkShadowColor={Colors().darkShadow}
                      lightShadowColor={Colors().lightShadow}>
                      <Icon
                        size={18}
                        name="minus"
                        type={IconType.AntDesign}
                        color={Colors().red}
                        style={styles.actionIcon}
                        onPress={action.bind(this, {
                          typeOfButton: 'minus',
                          itemData: allData,
                        })}
                      />
                    </NeumorphCard>
                  </View>
                )}
                {plusButton && (
                  <View>
                    <NeumorphCard
                      inner={true}
                      darkShadowColor={Colors().darkShadow}
                      lightShadowColor={Colors().lightShadow}>
                      <Icon
                        size={18}
                        name="plus"
                        type={IconType.AntDesign}
                        color={Colors().red}
                        style={styles.actionIcon}
                        onPress={action.bind(this, {
                          typeOfButton: 'plus',
                          itemData: allData,
                        })}
                      />
                    </NeumorphCard>
                  </View>
                )}

                {downButton && (
                  <View>
                    <NeumorphCard
                      inner={true}
                      darkShadowColor={Colors().darkShadow}
                      lightShadowColor={Colors().lightShadow}>
                      <Icon
                        size={18}
                        name={allData?.showTable[allData?.idx] ? 'up' : 'down'}
                        type={IconType.AntDesign}
                        color={
                          allData?.itm?.Old_Price_Viewed
                            ? Colors().aprroved
                            : Colors().red
                        }
                        style={styles.actionIcon}
                        onPress={action.bind(this, {
                          typeOfButton: 'down',
                          itemData: allData,
                        })}
                      />
                    </NeumorphCard>
                  </View>
                )}
                {feedbackButton && (
                  <View>
                    <NeumorphCard
                      inner={true}
                      darkShadowColor={Colors().darkShadow}
                      lightShadowColor={Colors().lightShadow}>
                      <Icon
                        size={18}
                        name={'feedback'}
                        type={IconType.MaterialIcons}
                        color={Colors().aprroved}
                        style={styles.actionIcon}
                        onPress={action.bind(this, {
                          typeOfButton: 'feedback',
                          itemData: allData,
                        })}
                      />
                    </NeumorphCard>
                  </View>
                )}
                {listButton && (
                  <View>
                    <NeumorphCard
                      inner={true}
                      darkShadowColor={Colors().darkShadow}
                      lightShadowColor={Colors().lightShadow}>
                      <Icon
                        size={18}
                        name={'list'}
                        type={IconType.Feather}
                        color={Colors().orange}
                        style={styles.actionIcon}
                        onPress={action.bind(this, {
                          typeOfButton: 'list',
                          itemData: allData,
                        })}
                      />
                    </NeumorphCard>
                  </View>
                )}
                {attachmentButton && (
                  <View>
                    <NeumorphCard
                      inner={true}
                      darkShadowColor={Colors().darkShadow}
                      lightShadowColor={Colors().lightShadow}>
                      <Icon
                        size={18}
                        name={'attachment'}
                        type={IconType.Entypo}
                        color={Colors().orange}
                        style={styles.actionIcon}
                        onPress={action.bind(this, {
                          typeOfButton: 'attachment',
                          itemData: allData,
                        })}
                      />
                    </NeumorphCard>
                  </View>
                )}

                {reactiveButton && (
                  <View>
                    <NeumorphCard
                      inner={true}
                      darkShadowColor={Colors().darkShadow}
                      lightShadowColor={Colors().lightShadow}>
                      <Icon
                        size={18}
                        name={'restore'}
                        type={IconType.MaterialCommunityIcons}
                        color={Colors().partial}
                        style={styles.actionIcon}
                        onPress={action.bind(this, {
                          typeOfButton: 'reactive',
                          itemData: allData,
                        })}
                      />
                    </NeumorphCard>
                  </View>
                )}
                {changeStatusButton && (
                  <View>
                    <NeumorphCard
                      inner={true}
                      darkShadowColor={Colors().darkShadow}
                      lightShadowColor={Colors().lightShadow}>
                      <Icon
                        size={18}
                        name={'cycle'}
                        type={IconType.Entypo}
                        color={Colors().red}
                        style={styles.actionIcon}
                        onPress={action.bind(this, {
                          typeOfButton: 'cycle',
                          itemData: allData,
                        })}
                      />
                    </NeumorphCard>
                  </View>
                )}
                {discardButton && (
                  <View>
                    <NeumorphCard
                      inner={true}
                      darkShadowColor={Colors().darkShadow}
                      lightShadowColor={Colors().lightShadow}>
                      <Icon
                        size={18}
                        name={'ban'}
                        type={IconType.FontAwesome}
                        color={Colors().partial}
                        style={styles.actionIcon}
                        onPress={action.bind(this, {
                          typeOfButton: 'discard',
                          itemData: allData,
                        })}
                      />
                    </NeumorphCard>
                  </View>
                )}
                {timelineButton && (
                  <View>
                    <NeumorphCard
                      inner={true}
                      darkShadowColor={Colors().darkShadow}
                      lightShadowColor={Colors().lightShadow}>
                      <Icon
                        size={18}
                        name={'timeline'}
                        type={IconType.MaterialIcons}
                        color={Colors().red}
                        style={styles.actionIcon}
                        onPress={action.bind(this, {
                          typeOfButton: 'timeline',
                          itemData: allData,
                        })}
                      />
                    </NeumorphCard>
                  </View>
                )}
                {changeButton && (
                  <View>
                    <NeumorphCard
                      inner={true}
                      darkShadowColor={Colors().darkShadow}
                      lightShadowColor={Colors().lightShadow}>
                      <Icon
                        size={18}
                        name={'cycle'}
                        type={IconType.Entypo}
                        color={Colors().red}
                        style={styles.actionIcon}
                        onPress={action.bind(this, {
                          typeOfButton: 'change',
                          itemData: allData,
                        })}
                      />
                    </NeumorphCard>
                  </View>
                )}
                {toolButton && (
                  <View>
                    <NeumorphCard
                      inner={true}
                      darkShadowColor={Colors().darkShadow}
                      lightShadowColor={Colors().lightShadow}>
                      <Icon
                        size={18}
                        name={'tools'}
                        type={IconType.Entypo}
                        color={Colors().red}
                        style={styles.actionIcon}
                        onPress={action.bind(this, {
                          typeOfButton: 'tool',
                          itemData: allData,
                        })}
                      />
                    </NeumorphCard>
                  </View>
                )}
                {calenderButton && (
                  <View>
                    <NeumorphCard
                      inner={true}
                      darkShadowColor={Colors().darkShadow}
                      lightShadowColor={Colors().lightShadow}>
                      <Icon
                        size={18}
                        name={'calendar'}
                        type={IconType.AntDesign}
                        color={Colors().purple}
                        style={styles.actionIcon}
                        onPress={action.bind(this, {
                          typeOfButton: 'calender',
                          itemData: allData,
                        })}
                      />
                    </NeumorphCard>
                  </View>
                )}
                {doubleCheckButton && (
                  <View>
                    <NeumorphCard
                      inner={true}
                      darkShadowColor={Colors().darkShadow}
                      lightShadowColor={Colors().lightShadow}>
                      <Icon
                        size={18}
                        name={'check-double'}
                        type={IconType.FontAwesome5}
                        color={Colors().red}
                        style={styles.actionIcon}
                        onPress={action.bind(this, {
                          typeOfButton: 'doubleCheck',
                          itemData: allData,
                        })}
                      />
                    </NeumorphCard>
                  </View>
                )}
                {autoDeletButton && (
                  <View>
                    <NeumorphCard
                      inner={true}
                      darkShadowColor={Colors().darkShadow}
                      lightShadowColor={Colors().lightShadow}>
                      <Icon
                        size={18}
                        name={'auto-delete'}
                        type={IconType.MaterialIcons}
                        color={Colors().red}
                        style={styles.actionIcon}
                        onPress={action.bind(this, {
                          typeOfButton: 'autoDelete',
                          itemData: allData,
                        })}
                      />
                    </NeumorphCard>
                  </View>
                )}
                {imageButton && (
                  <View>
                    <NeumorphCard
                      inner={true}
                      darkShadowColor={Colors().darkShadow}
                      lightShadowColor={Colors().lightShadow}>
                      <Icon
                        size={18}
                        name={'image'}
                        type={IconType.Ionicons}
                        color={Colors().purple}
                        style={styles.actionIcon}
                        onPress={action.bind(this, {
                          typeOfButton: 'image',
                          itemData: allData,
                        })}
                      />
                    </NeumorphCard>
                  </View>
                )}
                {savePdfButton && (
                  <View>
                    <NeumorphCard
                      inner={true}
                      darkShadowColor={Colors().darkShadow}
                      lightShadowColor={Colors().lightShadow}>
                      <Icon
                        size={18}
                        name={'file-pdf-o'}
                        type={IconType.FontAwesome}
                        color={Colors().aprroved}
                        style={styles.actionIcon}
                        onPress={action.bind(this, {
                          typeOfButton: 'savepdf',
                          itemData: allData,
                        })}
                      />
                    </NeumorphCard>
                  </View>
                )}
              </View>
            </View>
          )}
        </View>
      </NeumorphCard>

      {/*view for modal of upate */}
      {imageModalVisible && (
        <ImageViewer
          visible={imageModalVisible}
          imageUri={imageUri}
          cancelBtnPress={() => setImageModalVisible(!imageModalVisible)}
          // downloadBtnPress={item => downloadImageRemote(item)}
        />
      )}
    </View>
  );
};
// Custom comparison function for React.memo
function areEqual(prevProps, nextProps) {
  return prevProps.item === nextProps.item;
}

// export default memo(CustomeCard, areEqual);
export default CustomeCard;

const styles = StyleSheet.create({
  tableHeadingView: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainView: {
    marginHorizontal: WINDOW_WIDTH * 0.02,
    marginVertical: WINDOW_HEIGHT * 0.007,
  },
  headingTxt: {
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.2,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
    alignSelf: 'center',
    marginBottom: 2,
  },
  cardContainer: {
    margin: WINDOW_WIDTH * 0.02,
    flex: 1,
    rowGap: WINDOW_HEIGHT * 0.007,
  },
  bankCard: {
    margin: WINDOW_WIDTH * 0.02,
    padding: WINDOW_WIDTH * 0.02,
    rowGap: 10,
  },
  twoItemView: {
    flexDirection: 'row',
    columnGap: 5,
  },
  title: {
    fontSize: 15,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
    color: Colors().pureBlack,
    flexShrink: 1,
  },
  cardtext: {
    fontSize: 12,
    fontWeight: '300',
    lineHeight: 20,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
    flexShrink: 1,
  },
  actionView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
  },
  actionView2: {
    maxWidth: '50%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    columnGap: 5,
  },
  cardHeadingTxt: {
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 20,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
  },
});
