import { Link } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { AppText, Button } from '../src/components';
import { colors, spacing } from '../src/theme';

export default function NotFoundScreen() {
  return (
    <View style={styles.container}>
      <AppText variant="title" accessibilityRole="header">
        Page not found
      </AppText>
      <AppText variant="body" color={colors.textSecondary}>
        This screen does not exist in the demo.
      </AppText>
      <Link href="/" asChild>
        <Button label="Back to Home" onPress={() => {}} variant="secondary" />
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    padding: spacing.xxl,
    backgroundColor: colors.background,
  },
});
