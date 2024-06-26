import { ref } from 'vue';

export const useModalVisible = () => {
  const modalVisble = ref(false);
  const showModal = () => {
    modalVisble.value = true;
  };
  const hideModal = () => {
    modalVisble.value = false;
  };
  return {
    modalVisble,
    showModal,
    hideModal,
  };
};
