import React, { useState, useEffect } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import DownArrow from "../../assets/svgs/DownArrow.svg";
import DownArrowLine from "../../assets/svgs/DownArrowLine.svg";
import { COLORS, MARGINS } from "../utils/styles";
import AppText from "./AppText";
import AppScrollView from "./AppScrollView";
import _ from "lodash";

export default function Dropdown({
  initialChoice,
  values,
  onPress,
  label,
  rounded,
  multiSelect,
}) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState([]);
  const [options, setOptions] = useState(values);

  useEffect(() => {
    !multiSelect ? setOpen(false) : null;
  }, [selected]);

  /**
   * Set default select values
   * for dropdown.
   */
  useEffect(() => {
    if (!_.isEmpty(initialChoice)) {
      if (multiSelect && !Array.isArray(initialChoice)) {
        setSelected([initialChoice]);
      } else {
        setSelected(initialChoice);
      }
    }
  }, [initialChoice]);

  const handleMultiSelect = (value) => {
    let includesOption = selected
      .map((option) => option.label)
      .includes(value.label);
    if (includesOption) {
      const filtered = selected.filter((a) => a.label !== value.label);
      onPress(filtered);
      return setSelected(filtered);
    }

    onPress([...selected, value]);
    setSelected([...selected, value]);
  };

  const handleSelect = (value) => {
    if (multiSelect) {
      return handleMultiSelect(value);
    }
    onPress(value);
    setSelected(value);
  };

  const selectedLabels = () => {
    let combinedLabels = "";
    selected.forEach((a, i) => {
      i > 0 ? (combinedLabels += `, ${a.label}`) : (combinedLabels += a.label);
    });
    if (combinedLabels.length > 40) {
      return combinedLabels.slice(0, 40) + "...";
    }

    return combinedLabels;
  };

  const initial = multiSelect && selected[0] === initialChoice;

  return (
    <View>
      <Pressable onPress={() => setOpen(!open)}>
        <View
          style={[
            styles.selected,
            rounded && styles.selectedRounded,
            rounded && open && styles.selectedRoundOpen,
          ]}
        >
          {multiSelect ? (
            <AppText style={initial && styles.inActive}>
              {selectedLabels() || label}
            </AppText>
          ) : (
            <AppText style={!selected && styles.inActive}>
              {selected.label || label}
            </AppText>
          )}
          {rounded ? (
            <DownArrowLine
              height={10}
              width={10}
              style={[styles.icon, open && styles.iconFlipped]}
            />
          ) : (
            <DownArrow
              height={10}
              width={10}
              style={[styles.icon, open && styles.iconFlipped]}
            />
          )}
        </View>
      </Pressable>
      {open && (
        <View style={[styles.container, rounded && styles.openRounded]}>
          <AppScrollView>
            {options.map((val, i) => {
              const isLast = i === options.length - 1;
              const multiSelected =
                multiSelect &&
                selected.map((option) => option.label).includes(val.label);
              return (
                <Pressable key={i} onPress={() => handleSelect(val)}>
                  <View
                    style={[
                      styles.options,
                      rounded && styles.optionsRounded,
                      rounded && isLast && styles.optionsRoundedLast,
                      multiSelect && isLast && styles.mb60,
                      multiSelected && styles.multiSelected,
                    ]}
                  >
                    <AppText>{val.label}</AppText>
                  </View>
                </Pressable>
              );
            })}
          </AppScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 180,
    position: "absolute",
    width: "100%",
  },
  icon: {
    marginLeft: MARGINS.mb2,
  },
  iconFlipped: {
    transform: [{ rotate: "180deg" }],
  },
  inActive: {
    color: COLORS.darkGray,
  },
  mb60: {
    marginBottom: 60,
  },
  multiSelected: {
    backgroundColor: COLORS.surveyBlue,
  },
  openRounded: {
    top: 40,
  },
  options: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.gray,
    borderTopWidth: 0,
    borderWidth: 1,
    padding: MARGINS.mb1,
    paddingHorizontal: MARGINS.mb2,
  },
  optionsRounded: {
    borderWidth: 1,
    height: 40,
    justifyContent: "center",
  },
  optionsRoundedLast: {
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  selected: {
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: COLORS.white,
  },
  selectedRoundOpen: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  selectedRounded: {
    borderColor: COLORS.gray,
    borderRadius: 12,
    borderWidth: 1,
    height: 40,
    justifyContent: "space-between",
    minWidth: 80,
    paddingHorizontal: MARGINS.mb3,
  },
});
